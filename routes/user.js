import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashpassword,
    });

    await newUser.save();

    return res.json({ message: "User Registered" });
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({message: "User is not registered"});
    };

    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword){
        return res.status(401).json({message: "Password is incorrect"});
    };

    const userData = {id: user._id, username: user.username, email: user.email}
    const token = jwt.sign(userData, process.env.SECRET_KEY, {expiresIn: '1h'});
    res.cookie("token", token, {httpOnly: true,sameSite: "none",secure: true, maxAge: 360000});
    const data = {id: user._id, username: user.username, email: user.email}
    return res.status(200).json({message: "Logged In Successfully", data});
});


router.post('/forgot-password', async (req,res) => {
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json("User not found.")
        };

        const token = jwt.sign({id: user._id}, process.env.SECRET_KEY, {expiresIn: "5m"});

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'gulamjoy321@gmail.com',
              pass: 'wubz lvqq wrof wvxa'
            }
          });
          
          var mailOptions = {
            from: 'gulamjoy321@gmail.com',
            to: email,
            subject: 'Reset Password',
            text: `http://localhost:3000/reset-password/${token}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
              return res.json({message: "error sending email"})
            } else {
              return res.json({status: true, message: "Email sent"})
            }
          });
          
    } catch{

    }
});

router.post('/reset-password/:token', async(req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    try{
        const decoded =  jwt.verify(token, process.env.SECRET_KEY);
        const id = decoded.id;
        const hashpassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate({_id: id}, {password: hashpassword});
        return res.json({status: true, message: "Password Updated"})
    } catch(err){
        console.log(err);
        return res.json({message: "invalid token or token expired"})
    }

});




const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json({ status: false, message: "no token" });
        }
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        
        next();


    } catch (err) {
        console.log(err);
        return res.json({ status: false, message: "error verifying user" });
    }
};


router.get('/verify', verifyUser, (req, res) => {
    const { id, username, email } = req.user;

    // You can use userData in your response or any other logic
    return res.json({ status: true, message: "authorized", user: { id, username, email } });
});


router.get('/logout', (req, res) => {
    res.clearCookie("token", { domain: "atg-social.netlify.app", secure: true });
    return res.json({status: true, message: "User logged out"})
})

export { router as UserRouter };
