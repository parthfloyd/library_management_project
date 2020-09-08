//This file contains book model
//It will be imported by the database/sequelize file
module.exports = (sequelize, type) => {
    return sequelize.define('book', {
        name: {
            type: type.STRING,
            allowNull: false
        },
        pages: {
            type: type.INTEGER,
            allowNull: false
        },
        release_year: {
            type: type.INTEGER,
            allowNull: false
        },
        publication: {
            type: type.STRING,
            allowNull: false
        },
        stock_quantity: {
            type: type.INTEGER,
            allowNull: true
        }
    })
}