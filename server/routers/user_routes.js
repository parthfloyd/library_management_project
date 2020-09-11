//This file contains all user and admin Routes
const express = require('express');
const { User, Book } =  require('../database/sequelize');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const Auth = require('../middleware/auth');
const AdminCheck = require('../middleware/adminCheck');
const user = require('../models/user');

const router = new express.Router();

//GET USERS
router.get('/users', Auth, AdminCheck, async(req,res) => {
    try{
        const users = await User.findAll();
        res.send(users);
    }
    catch(e) {
        res.status(501).send();
    }
    
})

//GET USERS Min : only id and name
router.get('/users/min', Auth, AdminCheck, async(req,res) => {
    try{
        const users = await User.findAll({attributes: ['id','name']});
        res.send(users);
    }
    catch(e) {
        res.status(501).send();
    }
})

//Get USERS latest
router.get('/users/latest', Auth, AdminCheck, async(req,res) => {
    try{
        const weekAgoDate = new Date().setDate(new Date().getDate() - 7);
        const users = await User.findAll({attributes: ['id','name'], where: {
            createdAt: {
                [Op.gt]: weekAgoDate
            }
        }});
        res.send(users);
    }
    catch(e) {
        res.status(501).send();
    }
    
});

//Get user complete data including books
router.get('/users/:id', Auth, async(req,res) => {
    try{
        let user;
        if(req.role == "ADMIN"){
            user = await User.findOne({
                where: {
                    id: req.params.id
                },
                include: [Book],
                attributes: {
                    exclude: ['password']
                }
            });
        }
        else {
            user = await User.findOne({
                where: {
                    email: req.email
                },
                include: [Book],
                attributes: {
                    exclude: ['password','is_verified','createdAt','updatedAt','admin_flag']
                }
            });
        }
        res.send(user);
    }
    catch(e){
        res.status(501).send();
    }
})

//Get user alert for less return days for book -> returns empty list if none
router.get('/users/:id/bookalert', Auth, async(req,res) => {
    try{
        const user = await User.findOne({
            where: {
                id: req.params.id
            },
            include: [Book]
        });

        const bookAlert = [];
        const books = user.books;
        const weekAgoDate = new Date().setDate(new Date().getDate() - 7);
        for(book of books){
            if(book.UserBooks.createdAt< weekAgoDate){
                bookAlert.push(book);
            }
        }

        res.send(bookAlert);
    }
    catch(e){
        res.status(400).send("oh no");
    }
})

//update user details
router.patch('/users/:id', Auth, async(req,res) => {
    try{
        let emailChanged = false;
        let identityChanged = false;
        let passwordChanged = false;
        let hashedPassword = null;
        if(req.role == "ADMIN"){
            await User.update(req.body, {where: {
                id: req.params.id
            }});
        }
        else {
            //Checking if user hasn`t tweaked is verified or is_admin status
            if(req.body.admin_flag || req.body.is_verified){
                return res.status(400).send({message: "There seeems to be an unapplicable request"});
            }

            const user = await User.findOne({where:{
                email: req.email
            }});

            //Default saving hashed password-> workaround to save hashed unchanged password
            hashedPassword = user.password;

            //checking if user is changing password
            if(req.body.password){
                const isMatch = await bcrypt.compare(req.body.password, user.password);
                if(isMatch){
                    //Nothing to do since the password has not been changed
                } else {
                    hashedPassword = await bcrypt.hash(req.body.password, 8);
                    user.password = hashedPassword;
                    await user.setTokens([]);
                    await user.save();
                }
            }

            //If user is changing email, clear all tokens
            if(req.body.email){
                if(req.body.email !== req.email){
                    emailChanged = true;
                    await user.setTokens([]); 
                }
            }
            //Checking if update was done on identification image url
            if(req.body.identity_proof_url != user.identity_proof_url){
                user.is_verified = false;
                await user.setTokens([]);
                await user.save();
                identityChanged = true;
            }
            //updating data after hashing password.
            await User.update({...req.body, password:hashedPassword},
                {
                    where: {
                        email: req.email
                    }
            });
        }
        res.send({...req.body,emailChanged, identityChanged, passwordChanged});
    }catch(e) {
        res.status(501).send(e.message);
    }
});

//delete user 
router.delete('/users/:id', Auth, AdminCheck, async(req,res) => {
    try{
        await User.destroy({
            where: {
                id: req.params.id
            }
        });
        res.send("User Deleted!");
    }
    catch(e){
        res.status(501).send();
    }
    
})

//Lend Book by user
router.post('/users/:id', Auth, async(req,res) => {
    try{
        //Fetching book and user
        const user = await User.findOne({where: {
            id: req.params.id
        }});
        const book = await Book.findOne({
            where: {
                id: req.body.bookId
            }
        });
        //Adding book to the user
        const bookAlreadyIssued = await user.hasBook(book);
        if(book.stock_quantity > 0 && !bookAlreadyIssued) {
            await user.addBook(book);
        } else {
            return res.status(400).send({message: "Sorry Book can be issued only once!"});
        }

        //Decreasing quantity by one
        book.decrement('stock_quantity')

        res.send({message: "Congratulations! Book issued successfully!"});
    }
    catch(e) {
        res.status(400).send({message: "Book is unavailable"});
    }

});

//Check if user has a book
router.get('/users/:userid/hasbook/:bookid', Auth, async(req,res) => {
    try{
        //Fetching book and user
        const user = await User.findOne({where: {
            id: req.params.userid
        }});
        const book = await Book.findOne({
            where: {
                id: req.params.bookid
            }
        });
        //Adding book to the user
        const bookAlreadyIssued = await user.hasBook(book);
        res.send({hasBook: bookAlreadyIssued});
    }
    catch(e) {
        res.status(400).send({message: "Some error encountered!"});
    }

});

//Return a lent book
router.get('/users/:userid/returnbook/:bookid', Auth, async( req, res) => {
    try{
        //Fetching book and user
        const user = await User.findOne({where: {
            id: req.params.userid
        }});
        const book = await Book.findOne({
            where: {
                id: req.params.bookid
            }
        });
        //Check if user already has that book
        if(await user.hasBook(book)){
            await user.removeBook(book); //removing book from the user
            book.increment('stock_quantity'); //incrementing stock quantity by 1
            res.send({message: "Book Returned!"})
        }
        else {
            res.status(400).send({message: "Please check your request"});
        }
    }
    catch(e){
        res.status(501).send({message: "Internal server error"});
    }
})




module.exports = router;