const userModel = require('../models/user.model')
const userService = require('../services/user.service')
const {validationResult} = require('express-validator')

module.exports.RegisterUser = async (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors : error.array() })
    }

    const {fullname, email, password} = req.body;

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email, 
        password: hashedPassword,
    });

    const token = user.generateAuthToken();

    res.status(201).json({token, user});
}

module.exports.LoginUser = async (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json( {error: error.array() } )
    }

    const {email, password} = req.body;

    const match = await userModel.findOne({email}).select("+password");

    if(!match){
        return res.status(400).json({ error: "Invalid email or password" });
    }

    const passwordCorrect = await match.comparePassword(password);

    if(!passwordCorrect){
        return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = match.generateAuthToken();

    res.status(201).json({token, match});
}

module.exports.GetProfile = async(req, res, next) => {
    
}