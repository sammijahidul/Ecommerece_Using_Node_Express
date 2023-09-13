import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import fs from 'fs';
import braintree from "braintree";
import dotenv from 'dotenv'

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

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

        // if(product.photo.data) {
        //     res.set('Content-type', product.photo.contentType);
        //     return res.status(200).send(product.photo.data);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });    
        }
        if (product.photo && product.photo.data) {
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        } else {
            return res.status(404).json({
                success: false,
                message: 'No Photo available for this product'
            })
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

export const productFilterController = async (req, res) => {
    try {
        const {checked, radio} = req.body;
        let args = {}
        if(checked.length > 0) args.category = checked;
        if(radio.length) args.price = {$gte: radio[0], $lte: radio[1]}
        const products = await productModel.find(args)
        res.status(200).send({
            success: true, 
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while filtering products'
        })
    }
};

export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total
        })       
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in product count'
        })
    }
};

export const productListController = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel
           .find({})
           .select('-photo')
           .skip((page-1) * perPage)
           .limit(perPage)
           .sort({createdAt: -1});
        res.status(200).send({
            success: true,
            products
        })   

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while listing product'
        })
    }
};

export const searchProductController = async (req, res) => {
    try {
        const {keyword} = req.params
        const results = await productModel.find({
            $or: [
                {name:{$regex : keyword, $options: 'i'}},
                {description:{$regex : keyword, $options: 'i'}},
            ]
        }).select('-photo');

        res.json(results);

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while searching product'
        })
    }
};

export const relatedProductController = async (req, res) => {
    try {
        const {pid, cid} = req.params;
        const products = await productModel.find({
            category: cid,
            _id: {$ne: pid}
            })
            .select('-photo')
            .limit(3)
            .populate('category');    
        res.status(200).send({
            success: true,
            products
        });    
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'While getting related product',
            error
        })
    }
};

export const categoryPorductsController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({slug:req.params.slug});
        const products = await productModel.find({category}).populate('category')
        res.status(200).send({
            success: true,
            category,
            products
        })        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while getting products',
            error
        })
    }
};

//payment gateway api
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function(err, response) {
            if(err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
        
    } catch (error) {
        console.log(error)
    }   
};

export const braintreePaymentController = async (req, res) => {
    try {
        const {cart, nonce} = req.body;
        let total = 0
        cart.map((i) => {
            total += i.price
        });
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true,
            },
        },
        function(error, result) {
            if(result) {
                const order = new orderModel({
                    products: cart,
                    payment: result,
                    buyer: req.user._id
                }).save();
                res.json({ ok: true })
            } else {
                res.status(500).send(error)
            }
        })
    } catch (error) {
        console.log(error)
    }
};

