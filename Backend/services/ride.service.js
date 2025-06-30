const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const captainModel = require('../models/captain.model');

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    // ✅ Get distance and duration from map service
    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    // ✅ Defensive check for API response
    if (
        !distanceTime ||
        !distanceTime.distance ||
        !distanceTime.duration ||
        typeof distanceTime.distance.value !== 'number' ||
        typeof distanceTime.duration.value !== 'number'
    ) {
        throw new Error('Invalid distance or duration data from map service');
    }

    // ✅ Fare calculation rules
    const baseFare = { auto: 30, car: 50, motorcycle: 20 };
    const perKmRate = { auto: 10, car: 15, motorcycle: 8 };
    const perMinuteRate = { auto: 2, car: 3, motorcycle: 1.5 };

    const distanceInKm = distanceTime.distance.value / 1000;
    const durationInMin = distanceTime.duration.value / 60;

    const fare = {
        auto: Math.round(baseFare.auto + (distanceInKm * perKmRate.auto) + (durationInMin * perMinuteRate.auto)),
        car: Math.round(baseFare.car + (distanceInKm * perKmRate.car) + (durationInMin * perMinuteRate.car)),
        motorcycle: Math.round(baseFare.motorcycle + (distanceInKm * perKmRate.motorcycle) + (durationInMin * perMinuteRate.motorcycle))
    };

    return fare;
}

module.exports.getFare = getFare;


function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}


module.exports.createRide = async ({ user, pickup, destination, vehicleType }) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    // ✅ Calculate fare for the selected vehicle type
    const fareDetails = await getFare(pickup, destination);

    if (!fareDetails[vehicleType]) {
        throw new Error('Invalid vehicle type selected');
    }

    // ✅ Create and save the ride in MongoDB
    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        vehicleType,
        otp: getOtp(6),
        fare: fareDetails[vehicleType]
    });

    return ride;
};

module.exports.createOnSightRide = async ({ user, pickup, destination, vehicleType, plateNumber }) => {
    if (!user || !pickup || !destination || !vehicleType || !plateNumber) {
        throw new Error('All fields are required for On-Sight booking');
    }

    // ✅ Find captain by plate number
    const captain = await captainModel.findOne({ "vehicle.plate": plateNumber });

    if (!captain) {
        throw new Error('No captain found with this plate number');
    }

    // ✅ Calculate fare for the selected vehicle type
    const fareDetails = await getFare(pickup, destination);

    if (!fareDetails[vehicleType]) {
        throw new Error('Invalid vehicle type selected');
    }

    // ✅ Create ride with captain assigned directly
    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        vehicleType,
        captain: captain._id,
        otp: getOtp(6),
        fare: fareDetails[vehicleType],
        status: 'pending'
    });

    return ride;
};


module.exports.confirmRide = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    })

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}

module.exports.startRide = async ({ rideId, otp }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        console.log("gotcha");
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })

    return ride;
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}