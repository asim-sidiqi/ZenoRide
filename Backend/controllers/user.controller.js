const userModel = require('../models/user.model')
const userService = require('../services/user.service')
const {validationResult} = require(express-validator)

module.exports.RegisterUser = async (req, res, next) => {
    const error = validationResult(req);
}