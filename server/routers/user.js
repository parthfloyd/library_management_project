//This file contains user Routes
const express = require('express');
const { User } =  require('../database/sequelize');

const router = new express.Router();

router.get('/', (req,res) => {
    res.send("Hello world User!")
});

//Register User Route
router.post('/register', async (req,res) => {
    const user = await User.create(req.body);
    console.log(user);
    res.send("Yay");
    //todo-> hash the password , save and send back the token
})
module.exports = router;