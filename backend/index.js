const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const connectDB = require('./config/dbconfig');


connectDB();

const corsOptions = {
  origin: 'https://secret-messaging-plum.vercel.app', // Explicitly specify your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies and credentials
};

// Use the CORS middleware with the defined options
app.use(cors(corsOptions));

app.use(express.json());

const PORT = process.env.PORT || 10000

app.get('/',(req,res)=>{
    res.send("Hello")
})


app.use('/auth', authRoute);
app.use('/user', userRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

module.exports = app;