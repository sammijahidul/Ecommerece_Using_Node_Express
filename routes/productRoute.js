import express from 'express';
import {isAdmin, requireSignIn} from '../middlewares/authMiddleware.js';
import formidable from 'express-formidable';
import { createProductController } from '../controllers/productController.js';

const router = express.Router()

//routes
//Create Product 
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController )

//Update Product

//Get All Products

//Get A Product

//Delete A Product

export default router