const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
        select: false,
        minlength: [2, 'Password must be atleast 2 characters long']
    },
    socketId: {
        type: String
    },
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id },process.env.JWT_SECRET,{ expiresIn: '24h' })
    return token;
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function(password){
    const salt = bcrypt.genSaltSync(10);
    return await bcrypt.hash(password,salt);
}

const userModel = mongoose.model('user',userSchema);

module.exports = userModel;

