const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be atleast 5 characters long'],
    },
    password: {
        type: String,
        required: true,
        minlength: [2, 'Password must be atleast 2 characters long']
    },
    socketId: {
        type: String
    },
})
