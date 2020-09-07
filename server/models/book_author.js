//This file contains book_author model
//It will be imported by the database/sequelize file
module.exports = (sequelize, type) => {
    return sequelize.define('book', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: type.STRING,
            allowNull: false
        }
    })
}