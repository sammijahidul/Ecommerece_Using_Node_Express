import express from "express";

import { createCategoryController } from "../controllers/categoryController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router()

//router
router.post('create-category', requireSignIn, isAdmin, createCategoryController)

export default router