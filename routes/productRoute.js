import express from 'express';
import {isAdmin, requireSignIn} from '../middlewares/authMiddleware.js';
import formidable from 'express-formidable';
import { 
    createProductController, 
    deleteProductController, 
    getProductController, 
    getProductsController, 
    productPhotoController,
    updateProductController
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
router.patch('/update-product/:pid', 
            requireSignIn, 
            isAdmin, 
            formidable(), 
            updateProductController
);
//delete product
router.delete('/delete-product/:pid', 
            requireSignIn, 
            isAdmin, 
            deleteProductController
);
//Get All Products
router.get('/get-products', getProductsController);

//Get A Product
router.get('/get-product/:slug', getProductController);

//Get product photo
router.get('/product-photo/:pid', productPhotoController);


export default router