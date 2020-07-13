const dbConnectionProvider = require('./dbConnectionProvider')
const connectToDb = require('./connectToDb')


const dbConnection = connectToDb()
dbConnectionProvider.setDbConnection(dbConnection)


exports.user = require('./users')
exports.connection = dbConnectionProvider