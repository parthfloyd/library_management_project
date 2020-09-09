//This file contains all user and admin Routes
const express = require('express');
const { User, Book } =  require('../database/sequelize');
const { Op } = require('sequelize');
const Auth = require('../middleware/auth');
const AdminCheck = require('../middleware/adminCheck');

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
        if(req.role == "ADMIN"){
            const user = await User.findOne({
                where: {
                    id: req.params.id
                },
                include: [Book]
            });
        }
        else {
            const user = await User.findOne({
                where: {
                    email: req.email
                },
                include: [Book]
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
        if(req.role == "ADMIN"){
            await User.update(req.body, {where: {
                id: req.params.id
            }});
        }
        else {
            await User.update(req.body, {where: {
                email: req.email
            }});
        }
        
        res.send(await User.findOne({where: {
            id: req.params.id
        }}));
    }
    catch(e) {
        res.status(501).send();
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
            return res.send("Sorry Book is unavailable");
        }

        //Decreasing quantity by one
        book.decrement('stock_quantity')

        res.send("Done");
    }
    catch(e) {
        res.status(501).send();
    }

});

//Return a lent book
router.post('/users/:id/returnbook', Auth, async( req, res) => {
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
        //Check if user already has that book
        if(await user.hasBook(book)){
            await user.removeBook(book); //removing book from the user
            book.increment('stock_quantity'); //incrementing stock quantity by 1
            res.send("Book Returned!")
        }
        else {
            res.status(400).send("Please check your request");
        }
    }
    catch(e){
        res.status(501).send();
    }
})




module.exports = router;