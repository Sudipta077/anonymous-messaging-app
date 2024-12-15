const express = require('express');
const router = express.Router();
const db = require('../config/dbconfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        db.query(`select * from users where email = ?`, [email], (error, response) => {
            if (error) {
                console.log("Error is :", error);
                return res.status(500).json({ status: 500, message: "Error Occurred" });
            }
            else {

                if (response.length > 0) {
                    console.log("User Already exists...:", response);
                    return res.status(400).json({ status: 400, message: "User already exists." });
                }

                bcrypt.hash(password, 2, function (err, hashpass) {

                    db.query(`insert into users (name,email,password) values (?,?,?)`, [name, email, hashpass], (error, response) => {
                        if (error) {
                            console.log("Error while registering  : ", error);
                            return res.status(501).error(error);
                        }
                        else {
                            console.log("Successfully registered.");
                            res.status(200).json({ status: 200, message:"Successfully registered" });
                        }
                    })

                });
            }
        })
    }
    catch (err) {
        console.log("ERROR is err", err);
    }

})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        db.query(`select * from users where email =?`, [email], (error, response) => {
            if (error) {
                console.log("Error Occurred : ", error);
            }
            if (response.length > 0) {

                console.log(response[0].password);

                bcrypt.compare(password, response[0].password, function (err, result) {

                    if (err) {
                        console.log(err);
                    }
                    if (result !== true) {
                        return res.status(401).json({ status: 401, message: "Wrong Credential !" });
                    }
                    else {

                        const payload = { userId: response[0].id }; 
                        const token = jwt.sign(payload, process.env.SECRET_KEY); 

                        res.status(200).json({ status: 200, message: "Succesfully logged in " ,token})
                    }

                });

            }
            else{
                return res.status(400).json({status:400,message:"You Don't have any account registered !"})
            }
        })
    }
    catch (err) {
        console.log(err);
    }
})


module.exports = router;