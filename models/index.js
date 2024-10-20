const dbConfig = require('../config/dbConfig.js')

const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
        
        pool:{
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle,

        }
    }
)

sequelize.authenticate()
.then(() => {
    console.log('connecté')
})
.catch(err => {
    console.log('error : '+err)
})


const db ={}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.admis = require('./admisModel.js')(sequelize, DataTypes)
db.etudiants = require('./etudiantModel.js')(sequelize, DataTypes)
db.responsables = require('./responsableModel.js')(sequelize, DataTypes)

db.sequelize.sync({force: false})
.then(() => {
    console.log('Syncronisation réussi')
})

module.exports = db