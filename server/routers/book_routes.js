//This file contains book Routes
const express = require('express');
const { Book, BookAuthor, BookGenre } =  require('../database/sequelize');
const { Op } = require('sequelize');

const router = new express.Router();

//Create New book --> Expects book information in json and Returns book details on response. //=> Future versions. create books option, to add multiple books at once
router.post('/book', async(req,res) => {
    try{
        //Fetching book data which contains book details, authorname and category
        const bookData = req.body;
        const bookDetails = {
            name: bookData.name,
            pages: bookData.pages,
            release_year: bookData.release_year,
            publication: bookData.publication,
            stock_quantity: bookData.stock_quantity
        }
        //Creating book
        const book = await Book.create(bookDetails);

        //Adding book author details
        for (author of bookData.authors){
            console.log(author);
            //Check if author doesnt exist already
            const authorExists = await BookAuthor.findOne({where: {
                name: author
            }});
            if(authorExists){
                await book.addAuthor(authorExists);
            } else {
                const authorInstance = await BookAuthor.create({name: author});
                await book.addAuthor(authorInstance);
            }

        }

        //Adding categories
        let level = 0
        let category_under = null;
        for (category of bookData.category){
            //First check if the category with same level exists
            const categoryExists = await BookGenre.findOne({where: {category_name: category, category_level: level, category_under: category_under}});
            
            if(categoryExists) {
                await book.addCategory(categoryExists);
            } else {
                const categoryInstance = await BookGenre.create({category_name: category, category_level: level, category_under: category_under});
                await book.addCategory(categoryInstance);   
            }
            category_under = category;
            level += 1;
        }
        res.send(book);
        
    }
    catch(e) {
        console.log(e);
        res.status(501).send();
    }
});

//Get Books --> Basically sends back book details
router.get('/books', async (req,res)=> {
    try{
        const books = await Book.findAll() //findAll({include: BookAuthor})  if you want to include author details
        res.send(books);
    }
    catch(e){
        res.status(501).send();
    }
    
});

//Get Books low on quantity --> ALERT FOR BOOK WITH LOW QUANTITY
router.get('/books/lowquantity', async (req,res)=> {
    try{
        const books = await Book.findAll({where: {
            stock_quantity : {
                [Op.lt] : 5
            }
        }}) //findAll({include: BookAuthor})  if you want to include author details
        res.send(books);
    }
    catch(e){
        res.status(501).send();
    }
});

//Get Books Pagination--> Basically sends back book details
router.get('/books/pages/:offset', async (req,res)=> {
    try {
        const books = await Book.findAndCountAll({
            offset: +req.params.offset,
            limit: 12
        }) //findAll({include: BookAuthor})  if you want to include author details
        res.send(books);
    }
    catch(e){
        res.status(501).send();
    }
    
});

//Get Books Complete --> Basically sends back All book details
router.get('/books/complete', async (req,res)=> {
    try {
        const books = await Book.findAll({include: [BookAuthor, BookGenre]});
        res.send(books);
    }
    catch(e){
        res.status(501).send();
    }
});

//Get Books for a particular author --> Basically sends back book details
router.get('/books/author/:author', async (req,res)=> {
    try{
        const authors = await BookAuthor.findOne({include: Book, where: {
            name: req.params.author
        }});
        res.send(authors.books);
    }
    catch(e){
        res.status(501).send();
    }
    
});

//Get Books for a particular category --> Basically sends back book details
router.get('/books/category/:category', async (req,res)=> {
    try {
        const category = await BookGenre.findOne({include: Book, where: {category_name: req.params.category}}); //findAll({include: BookAuthor})  if you want to include author details
        res.send(category.books);
    }
    catch(e){
        res.status(501).send();
    }
});

//Get categories of the books --> Basically sends back name of categories along with level
router.get('/categories', async(req,res)=> {
    try{
        const categories = await BookGenre.findAll();
        res.send(categories);
    }
    catch(e){
        res.status(501).send();
    }
});

//Get categories under a particular category --> basically send back name of sub categories
router.get('/categories/:subcategory', async(req,res)=> {
    try{
        const categories = await BookGenre.findAll({where: {
            category_under: req.params.subcategory
        }});
        res.send(categories);   
    }
    catch(e){
        res.status(501).send();
    }
    
})

//Get authors of the books --> Basically sends back name of categories along with level
router.get('/categories', async(req,res)=> {
    try{
        const categories = await BookGenre.findAll();
        res.send(categories);
    }
    catch(e){
        res.status(501).send();
    }
});

//update book core details --> Most frequently used to update stock quantity, publication, etc.
router.patch('/books',async(req,res) => {
    try{
        await Book.update(req.body.user, {where: {
            id : req.body.id
        }});
        res.send("Book updated!");
    }
    catch(e){
        res.status(501).send();
    }
});

//update book author details --> To cover rare edge cases
router.patch('/books/authors', async(req,res) => {
    try {
        //Fetching the book
        const book = await Book.findOne({where: {id: req.body.bookId}});
        await book.setAuthors([]);
        //Adding book author details
        for (author of req.body.Authors){
            //Check if author doesnt exist already
            const authorExists = await BookAuthor.findOne({where: {
                name: author
            }});
            if(authorExists){
                await book.addAuthor(authorExists);
            } else {
                const authorInstance = await BookAuthor.create({name: author});
                await book.addAuthor(authorInstance);
            }
        }
        res.send("Book Author updated");
    }
    catch(e) {
        res.status(501).send();
    }
    
});

//update book categories --> To cover rare edge case
router.patch('/books/category', async(req,res) => {
    try{
        //Fetching the book
        const book = await Book.findOne({where: {id: req.body.bookId}});
        await book.setCategories([]);

        //Adding categories
        let level = 0
        let category_under = null;
        for (category of req.body.Categories){
            //First check if the category with same level exists
            const categoryExists = await BookGenre.findOne({where: {category_name: category, category_level: level, category_under: category_under}});
            if(categoryExists) {
                await book.addCategory(categoryExists);
            } else {
                const categoryInstance = await BookGenre.create({category_name: category, category_level: level, category_under: category_under});
                await book.addCategory(categoryInstance);   
            }
            category_under = category;
            level += 1;
        }

        res.send("Book Category updated");
    }
    catch(e) {
        res.status(501).send();
    }
    
    
})

//Delete book using id
router.delete('/books/:id', async(req, res) => {
    try{
        const book = await Book.findOne({where: {
            id: req.params.id
        }});
        if(book){
            await Book.destroy({where: {
                id:req.params.id
            }});
            res.send(`Deleted book with id: ${req.params.id}`);
        } else {
            res.status(400).send("Sorry no book found with the id!");
        }
    }
    catch(e) {
        res.status(501).send();
    }
    
    
})
module.exports = router;