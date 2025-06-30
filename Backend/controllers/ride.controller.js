const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');
const captainModel = require('../models/captain.model');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        // ✅ Step 1: Create the ride
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType
        });

        // ✅ Step 2: Get pickup coordinates for geospatial search
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);

        if (!pickupCoordinates) {
            return res.status(400).json({ message: "Invalid pickup address" });
        }

        const { lat, lng } = pickupCoordinates;

        // ✅ Step 3: Find nearby captains (within 2 km)
        const nearbyCaptains = await captainModel.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    $maxDistance: 4000 // 4 km
                }
            },
            "vehicle.vehicleType": vehicleType
        });

        console.log('Nearby captains found:', nearbyCaptains.length);

        // ✅ Step 4: Hide OTP before sending to captains
        ride.otp = "";

        // ✅ Step 5: Populate user details in ride before sending
        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        // ✅ Step 6: Emit "new-ride" event to all nearby captains
        nearbyCaptains.forEach(captain => {
            if (captain.socketId) {
                sendMessageToSocketId(captain.socketId, {
                    event: 'new-ride',
                    data: rideWithUser
                });
                console.log(`Sent new ride to captain ${captain._id} socket ${captain.socketId}`);
            }
        });

        // ✅ Step 7: Send ride response to user
        return res.status(201).json(ride);

    } catch (err) {
        console.error('Ride creation failed:', err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.createOnSightRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType, plateNumber } = req.body;

    try {
        // ✅ Step 1: Create the ride and assign captain using plate number
        const ride = await rideService.createOnSightRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType,
            plateNumber
        });

        
        // ✅ Step 2: Get captain details to send socket notification
        const captain = await captainModel.findOne({"vehicle.plate": plateNumber}).select('socketId _id');

        if (captain && captain.socketId) {
            // ✅ Step 3: Populate user details before sending
            const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

            sendMessageToSocketId(captain.socketId, {
                event: 'ride-on-sight',
                data: rideWithUser
            });

            console.log(`On-sight ride sent to captain ${captain._id} (Plate: ${plateNumber})`);
        }

        // ✅ Step 4: Return ride to user
        return res.status(201).json(ride);

    } catch (err) {
        console.error('On-Sight Ride creation failed:', err);
        return res.status(500).json({ message: err.message });
    }
};


module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        console.error('Fare calculation failed:', err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.error('Ride confirmation failed:', err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;
    console.log(otp);

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.error('Ride start failed:', err);
        
        // ✅ Handle known errors gracefully
        if (err.message === 'Invalid OTP') {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (err.message === 'Ride not found' || err.message === 'Ride not accepted') {
            return res.status(400).json({ message: err.message });
        }
        
        return res.status(500).json({ message: err.message });
    }
};

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.error('Ride end failed:', err);
        return res.status(500).json({ message: err.message });
    }
};