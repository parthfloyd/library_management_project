//This file contains book_genre model
//It will be imported by the database/sequelize file
module.exports = (sequelize, type) => {
    return sequelize.define('token', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        token_value: {
            type: type.STRING,
            allowNull: false
        }
    })
}