import userModel from '../models/userModel.js';
import { hashPassword } from '../helpers/authHelper.js';

export const registerController = async (req, res) => {
    try {
        const {name, email, password, phone, address} = req.body;

        //validation
        if(!name && !email && !password && !phone  && !address) {
            return res.send({error: 'Missed some field information please check'});
        }
        //check user
        const existingUser = await userModel.findOne({email: email})

        //existing user
        if(existingUser) {
            return res.status(200).send({
                success: true,
                message: 'Already Registered'
            })
        }
        //register user
        const hashedPassword = await hashPassword(password)
        //save
        const user = await new userModel({
            name, 
            email, 
            phone, 
            address, 
            password:hashedPassword
        }).save();

        res.status(201).send({
            success: true,
            message: 'User Registration successfull',
            user
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error with Registration',
            error
        })
    }

};

