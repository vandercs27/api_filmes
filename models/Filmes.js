const { DataTypes } = require("sequelize")
const db = require("../db/conn")

const Filmes = db.define("Filmes", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    filme: {
        type: DataTypes.STRING,
        allowNull: false
    },

    ano: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, 

    diretor: {
        type: DataTypes.STRING,
        allowNull: false
    },

     elenco: {
        type: DataTypes.STRING,
        allowNull: false
    },

    sinopse: {
        type: DataTypes.STRING(500),
        allowNull: false
        
    },
    curiosidades: {
        type: DataTypes.STRING(500  ),
        allowNull: false
    },

    imagem: {
        type: DataTypes.STRING,
        allowNull: false
    }
   
})

module.exports = Filmes