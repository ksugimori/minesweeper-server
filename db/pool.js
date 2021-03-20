const mysql = require('mysql2')

// create the connection to database
const pool = mysql.createPool({
  host: process.env.MS_DB_HOST,
  user: 'ms-user',
  password: 'ms-password',
  database: 'minesweeper'
})

module.exports = pool
