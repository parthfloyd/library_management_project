//This file contains the code for connecting to the database and adding models using Sequelize ORM
const {Sequelize} = require('sequelize');

//Models
const UserModel = require('../models/user');
const BookModel = require('../models/book');
const AdminModel = require('../models/admin');
const BookAuthorModel = require('../models/book_author');
const BookGenreModel = require('../models/book_genre');

//Fetching Database Connection URI From Environment Variables
const db_uri = process.env.DB_URI;


//Connecting to the database
const sequelize = new Sequelize(db_uri);

//Adding Models to Sequelize
const User = UserModel(sequelize, Sequelize);
const Book = BookModel(sequelize, Sequelize);
const Admin = AdminModel(sequelize, Sequelize);
const BookAuthor = BookAuthorModel(sequelize, Sequelize);
const BookGenre = BookGenreModel(sequelize, Sequelize);

(async() => {

    try{

        //Associations or Relations between tables
        //Many to Many Association between book and users
        await Book.belongsToMany(User, {through: 'UserBooks'});
        await User.belongsToMany(Book, {through: 'UserBooks'});

        //Many to many association between booka and authors
        await Book.belongsToMany(BookAuthor, {through: 'AuthorBooks'});
        await BookAuthor.belongsToMany(Book, {through: 'AuthorBooks'});

        //Syncing Models with the database
        await sequelize.sync();
        console.log('The Database and user table have been created');

    }
    catch(error) {

        console.log(error);

    }
    
})();

module.exports = {User, Book, Admin, BookAuthor, BookGenre} ;





/*Checking if the connection was established 
try {
    sequelize.authenticate().then(()=> {
        console.log('Connection has been established successfully.');

    })
    .catch ((error) => {
    console.error('Unable to connect to the database:', error);
    });
}
finally {
    console.log("DONE");
}
*/