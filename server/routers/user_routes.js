//This file contains all user and admin Routes
const express = require('express');
const { User, Book } =  require('../database/sequelize');
const { Op } = require('sequelize');

const router = new express.Router();

//GET USERS
router.get('/users', async(req,res) => {
    try{
        const users = await User.findAll();
        res.send(users);
    }
    catch(e) {
        res.status(501).send();
    }
    
})

//GET USERS Min : only id and name
router.get('/users/min', async(req,res) => {
    try{
        const users = await User.findAll({attributes: ['id','name']});
        res.send(users);
    }
    catch(e) {
        res.status(501).send();
    }
})

//Get USERS latest
router.get('/users/latest', async(req,res) => {
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
router.get('/users/:id', async(req,res) => {
    try{
        const user = await User.findOne({
            where: {
                id: req.params.id
            },
            include: [Book]
        });

        res.send(user);
    }
    catch(e){
        res.status(501).send();
    }
})

//update user details
router.patch('/users/:id', async(req,res) => {
    try{
        await User.update(req.body, {where: {
            id: req.params.id
        }});
        res.send(await User.findOne({where: {
            id: req.params.id
        }}));
    }
    catch(e) {
        res.status(501).send();
    }
});

//delete user 
router.delete('/users/:id', async(req,res) => {
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
router.post('/users/:id', async(req,res) => {
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

})


module.exports = router;