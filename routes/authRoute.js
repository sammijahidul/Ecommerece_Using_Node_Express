import express from "express";
import {registerController, loginController, testController} from '../controllers/authController.js';
import {requireSignIn} from '../middlewares/authMiddleware.js';

//router object
const router = express.Router();

//Register
router.post('/register', registerController)

//login 
router.post('/login', loginController);

//test routes
router.get('/test', requireSignIn, testController)

export default router; 