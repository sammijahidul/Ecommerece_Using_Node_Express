import express from "express";
import { 
    createCategoryController, 
    deleteCategory, 
    getSingleCategory, 
    gettingAllCategory, 
    updateCategoryController 
} from "../controllers/categoryController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router()

//router
//Create category route
router.post('/create-category', requireSignIn, isAdmin, createCategoryController);

//Update category route
router.patch('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);

//Get All category
router.get('/get-category', gettingAllCategory);

//Get single category
router.get('/single-category/:slug', getSingleCategory);

//Delete category
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategory)

export default router