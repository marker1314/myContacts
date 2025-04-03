const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET
const jwt = require("jsonwebtoken");

const getLogin = (req, res) => {
    res.render("home");
};

const loginUser = asyncHandler(async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if(!user) {
        return res.json({message: "일치하는 사용자는 없습니다."});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.json({message: "비밀번호가 옳바르지 않습니다."});
    }
    const token = jwt.sign({id: user._id}, jwtSecret);
    res.cookie("token", token, {httpOnly: true});
    res.redirect("/contacts");
});

const getRegister = (req, res) => {
    res.render("register");
};

const registerUser = asyncHandler(async (req, res) =>{
    const {username, password1, password2} = req.body;
    if(password1 === password2){
        const hashedPassword = await bcrypt.hash(password1, 10);        
        const user = await User.create({username, password:hashedPassword});
        res.json({message: "Register successful", user});
    } else{
        res.send("Registered Failed");
    }
});

module.exports = {
    getLogin,
    loginUser,
    getRegister,
    registerUser
};