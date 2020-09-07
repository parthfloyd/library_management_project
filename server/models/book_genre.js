//This file contains book_genre model
//It will be imported by the database/sequelize file
module.exports = (sequelize, type) => {
    return sequelize.define('book', {
        book_id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        category_name: {
            type: type.STRING,
            allowNull: false
        },
        category_level: {
            type: type.INTEGER,
            allowNull: false
        }
    })
}