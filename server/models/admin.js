//This file contains admin model
//It will be imported by the database/sequelize file
module.exports = (sequelize, type) => {
    return sequelize.define('admin', {
        name: {
            type: type.STRING,
            allowNull: false
        },
        email: {
            type: type.STRING,
            allowNull: false,
            unique: true
        },
        phone: {
            type: type.STRING,
            allowNull: false
        },
        password: {
            type: type.STRING,
            allowNull: false
        }
    })
}