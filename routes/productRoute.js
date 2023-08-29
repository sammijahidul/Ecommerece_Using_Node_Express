import express from 'express';
import {isAdmin, requireSignIn} from '../middlewares/authMiddleware.js';
import formidable from 'express-formidable';
import { 
    createProductController, 
    getProductController, 
    getProductsController 
} from '../controllers/productController.js';

const router = express.Router()

//routes
//Create Product 
router.post('/create-product', 
             requireSignIn, 
             isAdmin, 
             formidable(), 
             createProductController 
);

//Update Product

//Get All Products
router.get('/get-products', getProductsController);
//Get A Product
router.get('/get-product/:slug', getProductController);
//Delete A Product

export default router