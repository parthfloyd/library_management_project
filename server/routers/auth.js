//This file contains user Routes
const express = require('express');
const { User, Token, Admin } =  require('../database/sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = new express.Router();

router.get('/', (req,res) => {
    res.send("Hello world User!")
});

//AUTHENTICATION ROUTES FOR USERS ================================================================>>>>

//REGISTER User Route --> Accepts userData and returns created user data with token
router.post('/registeruser', async (req,res) => {
    try {
        const userData = req.body; //Fetching user data from req
        
        //Encrypting the password using bcrypt
        const password = await bcrypt.hash(userData.password, 8)

        //Generating token
        const token_value = await jwt.sign({email: userData.email}, process.env.JWT_SECRET_USER);
        const token = await Token.create({token_value});
        //creating user object with hashed password and adding to database
        const user = await User.create({
            ...userData, //ES6 spread operator to add userData from response
            password  //overriding password from userData with the hashed password
        });
        await user.addToken(token); //adding token to the user
        res.status(201).send({user, token});
    }
    catch (e) { //Todo  -> set custom error message for production
        res.status(400).send(e);
    }
});

//LOGIN USER ROUTE -->
router.post('/loginuser', async(req, res) => {
    try {
        //Fetching user credentials
        const userData = req.body;
        const email = userData.email;
        const password = userData.password;
        const user = await User.findOne({where: {email: email}});
        if(user){
            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch) {
                //Generating token
                const token_value = await jwt.sign({email: userData.email}, process.env.JWT_SECRET_USER);
                const token = await Token.create({token_value});
                await user.addToken(token); //adding token to user
                res.send({user,token});
            } else {
                res.send("Sorry invalid credentials");
            }
        } else {
            res.status(400).send("sorry user not found");
        }

    }
    catch (e) { //Todo  -> set custom error message for production
        res.status(400).send(e);
    }
});

//LOGOUT User Route ---->
router.post('/logoutuser', async(req,res) => {
    try { 
        const email = req.body.email;
        const token_value = req.body.token_value;

        //Finding user
        const user = await User.findOne({where: {email: email}}); //finding user using email
        //finding token -- to enable cross check if someone tries to logout another user
        const token = await Token.findOne({where: {token_value}});
        if(token){
            if(token.userId === user.id){
                const tokens = await Token.destroy({where:{userId: user.id}});
                res.send("User Logged out succesfully");
            }
        } else {
            res.send(400).send("Sorry some error encountered!");
        }
    }
    catch(e) {
        res.status(400).send(e);
    }
});

//AUTHENTICATION ROUTES FOR ADMINS ================================================================>>>>

//Register Admin Route --> Accepts adminData and returns created admin data with token
router.post('/registeradmin', async (req,res) => {
    try {
        const adminData = req.body; //Fetching user data from req
        
        //Encrypting the password using bcrypt
        const password = await bcrypt.hash(adminData.password, 8)

        //Generating token
        const token_value = await jwt.sign({email: adminData.email}, process.env.JWT_SECRET_ADMIN);
        const token = await Token.create({token_value});
        console.log("token...." ,token);
        //creating user object with hashed password and adding to database
        const admin = await Admin.create({
            ...adminData, //ES6 spread operator to add userData from responses
            password  //overriding password from userData with the hashed password
        });
        await admin.addToken(token); //adding token to the user

        res.status(201).send({admin, token});
    }
    catch (e) {
        res.status(400).send(e);
    }
})


//LOGIN Admin ROUTE -->
router.post('/loginadmin', async(req, res) => {
    try {
        //Fetching user credentials
        const adminData = req.body;
        const email = adminData.email;
        const password = adminData.password;
        const admin = await Admin.findOne({where: {email: email}});
        if(admin){
            const isMatch = await bcrypt.compare(password, admin.password);
            if(isMatch) {
                //Generating token
                const token_value = await jwt.sign({email: adminData.email}, process.env.JWT_SECRET_ADMIN);
                const token = await Token.create({token_value});
                await admin.addToken(token); //adding token to admin
                res.send({admin,token});
            } else {
                res.status(400).send("Sorry invalid credentials");
            }
        } else {
            res.status(400).send("Sorry invalid credentials");
        }

    }
    catch (e) { //Todo  -> set custom error message for production
        res.status(400).send(e);
    }
});

//LOGOUT Admin Route ---->
router.post('/logoutadmin', async(req,res) => {
    try { 
        const email = req.body.email;
        const token_value = req.body.token_value;

        //Finding user
        const admin = await Admin.findOne({where: {email: email}}); //finding user using email
        //finding token -- to enable cross check if someone tries to logout another user
        const token = await Token.findOne({where: {token_value}});
        if(token){
            if(token.adminId === admin.id){
                const tokens = await Token.destroy({where:{adminId: admin.id}});
                res.send("Admin Logged out succesfully");
            }
        } else {
            res.send(400).send("Sorry some error encountered!");
        }
    }
    catch(e) {
        res.status(400).send(e);
    }
});

module.exports = router;