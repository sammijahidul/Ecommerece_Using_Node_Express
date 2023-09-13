import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import productRoute from './routes/productRoute.js'
import cors from 'cors';
import path from 'path'
import { fileURLToPath } from 'url';

//configure env
dotenv.config();

//database config
connectDB();

//ESMODULE FIX
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//express app
const app = express();
// app.use(express.urlencoded({ extended: true }));

//middleware
app.use(cors({origin: true, credentials: true}));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './client/build')))


//routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/product', productRoute);

//rest api
app.use('*', function(req, res) {
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
});

const PORT = process.env.PORT || 8002;

app.listen(PORT, () => {
    console.log(`Server is Running in ${process.env.DEV_MODE} mode & listening on http://localhost:${PORT}`);
});

