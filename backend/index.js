const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const connectDB = require('./config/dbconfig');

connectDB();


app.use(cors({
    origin: 'https://secret-messaging-plum.vercel.app', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true 
}));

app.use(express.json());


const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("Hello");
});

app.use('/auth', authRoute);
app.use('/user', userRoute);

module.exports = app;
