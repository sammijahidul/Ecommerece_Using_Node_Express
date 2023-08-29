import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from 'fs';

export const createProductController = async(req, res) => {
    try {
        const {name, slug, description, price, category, quantity, shipping} = req.fields
        const {photo} = req.files 
        //validation
        switch(true){
            case !name:
                return res.status(500).send({error: 'Name is Required'})
            case !description:
                return res.status(500).send({error: 'Description is Required'})
            case !price:
                return res.status(500).send({error: 'Price is Required'})
            case !category:
                return res.status(500).send({error: 'Category is Required'})
            case !quantity:
                return res.status(500).send({error: 'Quantity is Required'})
            case photo && photo.size > 1000000:
                return res.status(500).send({error: 'Photo is Required & should be less than 1mb'})    
        }
        const newProduct = new productModel({...req.fields, slug: slugify(name)})
        if(photo) {
            newProduct.photo.data = fs.readFileSync(photo.path)
            newProduct.photo.contentType = photo.type
        }
        await newProduct.save();
        res.status(201).send({
            success: true,
            message: "Product created successfully",
            newProduct
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while creating product'
        })
    }
};

export const getProductsController = async(req, res) => {
    try {
        const products = await productModel
           .find({})
           .populate('category')
           .select('-photo')
           .limit(12)
           .sort({createdAt: -1});
        res.status(200).send({
            success: true,
            totalProducts: products.length,
            message: 'All Products',
            products,
            
        });          
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,           
            message: 'Errow while getting products',
            error: error.message
        })
    }
};

export const getProductController = async (req, res) => {
    try {
        const product = await productModel.
            findOne({slug: req.params.slug})
            .select('-photo')
            .populate('category');
        if(!product) {
            return res.status(404).send({
                success: true,
                message: 'Not found a product by this name',                
            })
        }
        res.status(200).send({
            success: true,
            message: 'Successfully showing a product',
            product
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while getting a product',
            error: error.message
        })
    }
};

export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select('photo');
        if(product.photo.data) {
            res.set('Content-type', product.photo.contentType);
            return res.status(200).send(product.photo.data)
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while getting image',
            error
        })
    }
};

export const updateProductController = async (req, res) => {
    try {
        const {name, slug, description, price, category, quantity, shipping} = req.fields
        const {photo} = req.files 
        //validation
        switch(true){
            case !name:
                return res.status(500).send({error: 'Name is Required'})
            case !description:
                return res.status(500).send({error: 'Description is Required'})
            case !price:
                return res.status(500).send({error: 'Price is Required'})
            case !category:
                return res.status(500).send({error: 'Category is Required'})
            case !quantity:
                return res.status(500).send({error: 'Quantity is Required'})
            case photo && photo.size > 1000000:
                return res.status(500).send({error: 'Photo is Required & should be less than 1mb'})    
        }
        const updateProduct = await productModel.findByIdAndUpdate(
                req.params.pid, 
                {...req.fields, slug: slugify(name)}, 
                {new: true}
                );
        if(photo) {
            updateProduct.photo.data = fs.readFileSync(photo.path)
            updateProduct.photo.contentType = photo.type
        }
        await updateProduct.save();
        res.status(201).send({
            success: true,
            message: "Product updated successfully",
            updateProduct
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while updating product'
        })
    }
};

export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select('-photo');
        res.status(200).send({
            success: true,
            message: 'Successfully deleted the product'
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while updating product',
            error
        })
    }
};