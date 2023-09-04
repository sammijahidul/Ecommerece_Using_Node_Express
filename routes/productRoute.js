import express from 'express';
import {isAdmin, requireSignIn} from '../middlewares/authMiddleware.js';
import formidable from 'express-formidable';
import { 
    categoryPorductsController,
    createProductController, 
    deleteProductController, 
    getProductController, 
    getProductsController, 
    productCountController, 
    productFilterController, 
    productListController, 
    productPhotoController,
    relatedProductController,
    searchProductController,
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

//filter product
router.post('/filter-products', productFilterController);

//product count
router.get('/product-count', productCountController);

//product per page
router.get('/product-list/:page', productListController);

//search product
router.get('/product-search/:keyword', searchProductController);

//Similar product
router.get('/related-product/:pid/:cid', relatedProductController);

//Category based products
router.get('/category-products/:slug', categoryPorductsController)


export default router