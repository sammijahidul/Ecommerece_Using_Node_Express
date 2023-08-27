import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js';
import cors from 'cors';

//configure env
dotenv.config();

//database config
connectDB();

//express app
const app = express();
// app.use(express.urlencoded({ extended: true }));

//middleware
app.use(cors({origin: true, credentials: true}));
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use('/api/v1/auth', authRoute);

//rest api
app.get('/', (req, res) => {
    res.send({
        message: 'Welcome to this ecommerce app'
    })
});

const PORT = process.env.PORT || 8002;

app.listen(PORT, () => {
    console.log(`Server is Running in ${process.env.DEV_MODE} mode & listening on http://localhost:${PORT}`);
});

