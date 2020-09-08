//This file contains book_author model
//It will be imported by the database/sequelize file
module.exports = (sequelize, type) => {
    return sequelize.define('book_author', {
        name: {
            type: type.STRING,
            allowNull: false
        }
    },{
        name: {
            singular: 'Author',
            plural: 'Authors'
        }
    })
}