import express from "express";
import {registerController, loginController, testController, forgotPasswordController} from '../controllers/authController.js';
import {isAdmin, requireSignIn} from '../middlewares/authMiddleware.js';

//router object
const router = express.Router();

//Register
router.post('/register', registerController)

//login 
router.post('/login', loginController);

//forgot Password
router.post('/forgot-password', forgotPasswordController);

//test routes
router.get('/test', requireSignIn, isAdmin, testController);

//protected route auth
router.get('/user-auth', requireSignIn, (req,res) => {
    res.status(200).send({ ok: true});
})

export default router; 