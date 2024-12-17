const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const connectDB = require('./config/dbconfig');


connectDB();

app.use(cors());
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