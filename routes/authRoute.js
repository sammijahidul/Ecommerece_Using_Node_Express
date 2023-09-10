import express from "express";
import {
    registerController, 
    loginController, 
    testController, 
    forgotPasswordController, 
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    orderStatusUpdateController
} from '../controllers/authController.js';
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

//protected route auth for user
router.get('/user-auth', requireSignIn, (req,res) => {
    res.status(200).send({ ok: true});
});

//protected route auth for admin
router.get('/admin-auth', requireSignIn, isAdmin, (req,res) => {
    res.status(200).send({ ok: true});
});

//update Profile
router.patch('/profile-update', requireSignIn, updateProfileController);

//orders
router.get('/orders', requireSignIn, getOrdersController);

//All orders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);

//order status update
router.patch('/order-status/:orderId', requireSignIn, isAdmin, orderStatusUpdateController);

export default router; 