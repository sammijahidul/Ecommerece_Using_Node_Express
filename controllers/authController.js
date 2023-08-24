import userModel from '../models/userModel.js';
import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import JWT from 'jsonwebtoken';

//Registration 
export const registerController = async (req, res) => {
    try {
        const {name, email, password, phone, address, answer} = req.body;

        //validation
        if(!name || !email || !password || !phone || !address || !answer) {
            return res.status(404).send({
                success: false,
                message: 'Some information is missing please check'
            })
        }
        //check user
        const existingUser = await userModel.findOne({email})

        //existing user
        if(existingUser) {
            return res.status(200).send({
                success: false,
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
            password:hashedPassword,
            answer
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

//login
export const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;

        //validation
        if(!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password'
            })
        }
        //check user
        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(404).send({
                success: false,
                message: 'Email is not registered'
            })
        }
        const matchPassword = await comparePassword(password, user.password);
        if(!matchPassword) {
            return res.status(200).send({
                success: false,
                message: 'Invalid Password'
            })
        }
        //token 
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {
            expiresIn: '7d',
        })
        res.status(200).send({
            success: true,
            message: 'Login successfully',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
            token,
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })
    }
};

//forgot Password
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, newPassword, answer } = req.body;
        if(!email) {
            res.status(400).send({
                message: "Email is required"
            })
        }
        if(!answer) {
            res.status(400).send({
                message: "Answer is required"
            })
        }
        if(!newPassword) {
            res.status(400).send({
                message: "New Password is required"
            })
        }
        //check 
        const user = await userModel.findOne({email, answer})
        console.log(user);
        //validation
        if(!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email or Answer"
            })
        }
        const hashedPassword = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashedPassword})
        res.status(200).send({
            success: true,
            message: 'Password reset successful',
        })        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
};

//test controller
export const testController = (req, res) => {
    res.send('protected routes');
}