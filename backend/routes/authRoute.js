const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema'); // Import the Mongoose schema
require('dotenv').config();

// Register Endpoint
router.post('/register', async (req, res) => {
    const { name, username, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ status: 400, message: "User already exists." });
        }

        // Hash the password
        const hashpass = await bcrypt.hash(password, 10);

        // Save the new user
        const newUser = new User({ name, username, password: hashpass });
        await newUser.save();

        res.status(200).json({ status: 200, message: "Successfully registered" });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ status: 500, message: "Error occurred" });
    }
});

// Login Endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ status: 400, message: "You don't have any account registered!" });
        }

        // Compare the passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: 401, message: "Wrong credentials!" });
        }

        // Generate JWT token
        const payload = { username: user.username };
        const token = jwt.sign(payload,SECRET_KEY);

        res.status(200).json({ status: 200, message: "Successfully logged in", token });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ status: 500, message: "Error occurred" });
    }
});

module.exports = router;
