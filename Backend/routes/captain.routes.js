const captainController = require('../controllers/captain.controller');
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

router.post('/register', [
    body('email').isEmail().withMessage("Email is invalid").isLength({ min: 5 }).withMessage("email must be atleast 5 characters long"),
    body('password').isLength({ min: 2 }).withMessage("password must be atleast 2 characters long"),
    body('vehicle.color').isLength({ min: 3 }).withMessage("Color should be atleast 3 characters long"),
    body('vehicle.plate').isLength({ min: 3 }).withMessage("Plate should be atleast 3 characters long"),
    body('vehicle.capacity').isNumeric().withMessage("Capacity should be a number").custom(value => value >= 1).withMessage("Capacity should be at least 1"),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage("Vehicle type should be either car, motorcycle or auto"),
],
    captainController.RegisterCaptain
)

module.exports = router;