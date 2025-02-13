const express = require('express')
const router = express.Router();
const { body } = require('express-validator')
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/register',[
    body('email').isEmail().withMessage("Email is invalid").isLength({min:5}).withMessage("email must be atleast 5 characters long"),
    body('password').isLength({min:2}).withMessage("password must be atleast 2 characters long"),
    body('fullname.firstname').isLength({min:3}).withMessage("First name should be atleast 5 characters long"),
    body('fullname.lastname').isLength({min:3}).withMessage("lastname should be ateast 3 characters long"),
],
    userController.RegisterUser
)

router.post('/login',[
    body('email').isEmail().withMessage("Email is invalid").isLength({min:5}).withMessage("email must be atleast 5 characters long"),
    body('password').isLength({min:2}).withMessage("password must be atleast 2 characters long"),
],
    userController.LoginUser
)

router.get('profile', authMiddleware.authUser, userController.GetProfile)
module.exports = router;