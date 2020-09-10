//This file contains user Routes
const express = require('express');
const { User, Token} =  require('../database/sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Auth = require('../middleware/auth');
const router = new express.Router();

router.get('/', (req,res) => {
    res.send("Hello world User!")
});


//REGISTER ROUTE ------>
router.post('/register', async (req,res) => {
    try {
        const data = req.body; //Fetching user data from req
        
        //Encrypting the password using bcrypt
        const password = await bcrypt.hash(data.password, 8);

        //creating user object with hashed password and adding to database
        const user = await User.create({
            ...data, //ES6 spread operator to add userData from response
            password  //overriding password from userData with the hashed password
        });
        res.status(201).send({message: "Congratulations! Your Request has been submitted! Admin will approve your registration Soon!"});
    }
    catch (e) { //Todo  -> set custom error message for production
        res.status(400).send(e);
    }
});

//Login Route ---->>
router.post('/login',async(req, res) => {
    try {
        //Fetching user credentials
        const data = req.body;
        const user = await User.findOne({where: {email: data.email}});
        if(user){
            const isMatch = await bcrypt.compare(data.password, user.password);
            if(isMatch) {
                //Generating token
                let token_value;
                if(!user.is_verified){
                    return res.status(400).send("NOT VERIFIED");
                }
                else if(user.admin_flag){
                    token_value = await jwt.sign({email: data.email,role:"ADMIN"}, process.env.JWT_SECRET_ADMIN);
                }
                else {
                    token_value = await jwt.sign({email: data.email,role:"USER"}, process.env.JWT_SECRET_USER);
                }
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

//Logout Route --->
//LOGOUT User Route ---->
router.post('/logout', Auth, async(req,res) => {
    try { 
        //Finding user
        const user = await User.findOne({where: {email: req.email}}); //finding user using email
        console.log()
        //finding token -- to enable cross check if someone tries to logout another user
        const token = await Token.findOne({where: {token_value: req.token}});
        if(token){
            if(token.userId === user.id){
                await Token.destroy({where:{userId: user.id}});
                res.send("User Logged out succesfully");
            }
        } else {
            res.status(400).send("Sorry some error encountered!");
        }
    }
    catch(e) {
        res.status(400).send(e);
    }
});
module.exports = router;