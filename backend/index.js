const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');




app.use(cors());
app.use(express.json());
const PORT = process.env.PORT



app.use('/auth', authRoute);
app.use('/user', userRoute);



app.listen(PORT, () => {
    console.log("App is listening at port :" + PORT);
})