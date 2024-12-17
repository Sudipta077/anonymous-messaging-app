const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require('../models/userSchema'); // User schema model
const Message = require('../models/messageSchema'); // Message schema model
require('dotenv').config();

// Verify User Route
router.get('/', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const { username } = decoded;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ status: 400, message: "User not found" });
        }

        res.status(200).json({ status: 200, message: "User verified", user });
    } catch (err) {
        console.error("Error verifying user:", err);
        return res.status(500).json({ status: 500, message: "Error verifying user" });
    }
});

// Add Message Route
router.post('/message/:username', async (req, res) => {
    const { username } = req.params;
    const { text } = req.body;

    console.log("username2--->", text);


    try {
        const user = await User.findOne({ username });


        if (!user) {
            return res.status(400).json({ status: 400, message: "User does not exist!" });
        }

        const message = new Message({
            message: text,
            username: username
        });

        await message.save();

        res.status(200).json({ status: 200, message: "Successfully sent message." });
    } catch (err) {
        console.error("Error adding message:", err);
        return res.status(500).json({ status: 500, message: "Error adding message." });
    }
});

// Get All Messages for a User
router.get('/message/getAll', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    try {

        const decoded = jwt.verify(token, SECRET_KEY);
        const { username } = decoded;
        const user = await User.findOne({ username });
        const messages = await Message.find({ username: user.username });

        if (!messages.length) {
            return res.status(404).json({ status: 404, message: "No messages found for this user." });
        }

        res.status(200).json({ status: 200, messages });
    } catch (err) {
        console.error("Error retrieving messages:", err);
        return res.status(500).json({ status: 500, message: "Error retrieving messages." });
    }
});


router.post('/deleteAll', async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        const decoded = jwt.verify(token, SECRET_KEY);
        const { username } = decoded;

        const result = await Message.deleteMany({ username: username });

        if (result.deletedCount > 0) {
            return res.status(200).json({status:200, message: 'All messages deleted successfully.' });
        } else {
            return res.status(404).json({status:404, message: 'No messages found.' });
        }





    }
    catch (err) {
        console.log("Error --->", err);
    }
})






// Google Gemini API Integration
router.get('/api/gemini', async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = "Generate a new, simple, friendly question about someone's personal life, under 10 words";

        const result = await model.generateContent(prompt);
        console.log(result.response.text());

        res.json({ prompt: result.response.text() });
    } catch (err) {
        console.error("Error using Gemini API:", err);
        return res.status(500).json({ message: "Error using Gemini API" });
    }
});

module.exports = router;
