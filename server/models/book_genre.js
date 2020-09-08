//This file contains book_genre model
//It will be imported by the database/sequelize file
module.exports = (sequelize, type) => {
    return sequelize.define('book_genre', {
        category_name: {
            type: type.STRING,
            allowNull: false
        },
        category_level: {
            type: type.INTEGER,
            allowNull: false
        },
        category_under: {
            type: type.STRING,
            allowNull: true
        }
    },{
        name: {
            singular: 'Category',
            plural: 'Categories'
        }
    })
}