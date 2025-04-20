const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("terror_no_ar", "root", "", {
    host: "localhost",
    dialect: "mysql"
})


module.exports = sequelize