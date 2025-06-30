import React, { useState } from 'react';

const OnSight = (props) => {
    const [plate, setPlate] = useState({
        l1: '', l2: '',
        n1: '', n2: '',
        l3: '', l4: '',
        n3: '', n4: '', n5: '', n6: ''
    });

    // Helper to handle input and auto-focus
    const handleChange = (e, key, type, nextKey) => {
        let val = e.target.value;
        if (type === 'letter') {
            val = val.replace(/[^A-Za-z]/g, '').toUpperCase();
            if (val.length > 1) val = val[0];
        } else {
            val = val.replace(/[^0-9]/g, '');
            if (val.length > 1) val = val[0];
        }
        setPlate(prev => ({ ...prev, [key]: val }));
        if (val && nextKey) {
            document.getElementById(nextKey)?.focus();
        }
    };

    const handleBookRide = () => {
        const plateNumber = `${plate.l1}${plate.l2}${plate.n1}${plate.n2}${plate.l3}${plate.l4}${plate.n3}${plate.n4}${plate.n5}${plate.n6}`.toUpperCase().trim();
        
        if (plateNumber.length < 5) {
            alert("Please enter a valid plate number (at least 5 characters).");
            return;
        }
        
        console.log(plateNumber);
        
        console.log(`Booking ride for plate: ${plateNumber}`);
        // Add booking logic here
        props.createOnSightRide(plateNumber);
        props.setOnSightPanel(false);
        props.setVehicleFound(true);
        props.setVehiclePanel(false);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border border-gray-200 rounded-lg shadow bg-white">
            <h2 className="text-center mb-6 text-2xl font-semibold">Enter Plate Number</h2>
            <div className="flex justify-around gap-2 mb-8">
                {Object.keys(plate).map((key, index, arr) => (
                    <input
                        key={key}
                        id={key}
                        type="text"
                        maxLength={1}
                        value={plate[key]}
                        onChange={e => handleChange(e, key, key.startsWith('l') ? 'letter' : 'number', arr[index + 1])}
                        className="w-7 h-11 text-2xl text-center border border-gray-400 rounded outline-none"
                        autoFocus={index === 0}
                    />
                ))}
            </div>
            <button
                className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg"
                onClick={handleBookRide}>
                Book Ride
            </button>
        </div>
    );
};

// const inputStyle = {
//     width: 36,
//     height: 44,
//     fontSize: 24,
//     textAlign: 'center',
//     border: '1px solid #bbb',
//     borderRadius: 4,
//     outline: 'none'
// };

export default OnSight;