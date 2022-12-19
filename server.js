require('dotenv').config();

const express = require('express');
const nodemailer = require("nodemailer");
const path = require("path");
const app = express();
const PORT = 3000;
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/contactform.html'))
})

app.post('/send_email', (req, res) => {
    try {
        const mailOptions = {
            from: req.body.email,
            to: process.env.MAIL_USER,
            subject: `Mailer from ${req.body.email}: ${req.body.subject}`,
            text: `Subject: ${req.body.subject}\n\n${req.body.message}\n\n${req.body.name}`
        }
        transporter.sendMail(mailOptions, function (){
            res.redirect("/")
        });
    } catch (e) {
        console.log(e)
    }
})

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})