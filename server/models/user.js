//This file contains user model
//It will be imported by the database/sequelize file
const bcrypt = require('bcryptjs');

module.exports = (sequelize, type) => {
    return sequelize.define('user', {
        
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
            allowNull: false,
        },
        identity_proof_url: {
            type: type.STRING,
            allowNull: false
        },
        date_of_birth: {
            type: type.DATEONLY
        }
    })
}