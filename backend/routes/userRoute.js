const express = require('express');
const router = express.Router();
const db = require('../config/dbconfig');
const jwt = require('jsonwebtoken')
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.get('/', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    try {
        var decoded = jwt.verify(token, process.env.SECRET_KEY);
        db.query(`select * from users where id =?`, [decoded.userId], (err, response) => {
            if (err) {
                console.log("error : ", err);
                return res.status(400).json({ status: 400, message: "User not found" });
            }

            res.status(200).json({ status: 200, message: "User verified", response });


        })

    }
    catch (err) {
        console.log(err);
    }


})

router.post('/message/:id', (req, res) => {
    const params = req.params;
    const message = req.body;
    console.log(params.id);
    console.log("message-->",message.text);
    db.query(`insert into messages (message,user_id) values (?,?)`, [message.text , params.id], (err, result) => {
        if (err) {
            console.log("Error 1 : ", err)
            return res.status(400).json({ status: 400, message: "User does not exist !" });
        }
        else {
            console.log("Successfully added message.", result);
            res.status(200).json({ status: 200, message: "Successfully sent message." });
        }
    })

})

router.get('/message/getAll', async (req, res) => {

    const token = req.headers['authorization']?.split(' ')[1];
    try {

        var decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decoded.userId)
        db.query(`select * from messages where user_id = ?`, [decoded.userId], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ status: 400, message: err })
            }
            else {
                console.log("result--->",result);
                return res.status(200).json({status:200,message:result});
            }
        })



    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ status: 500, message: err });
    }

})

router.get('/api/gemini', async (req, res) => {

    try{
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
        const prompt = "Generate a new, simple, friendly question about someone's personal life, under 10 words";
    
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        res.json(result.response.text());
    }
    catch(err){
        console.log(err);
        return res.json({message:err});
    }
   
})

module.exports = router;