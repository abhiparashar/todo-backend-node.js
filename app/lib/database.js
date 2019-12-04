const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'my_db'
})

connection.connect()

module.exports = {
    connection: connection
}