const mysql = require('mysql2')

// create the connection to database
const pool = mysql.createPool({
  host: process.env.MS_DB_HOST,
  user: process.env.MS_DB_USER,
  password: process.env.MS_DB_PASSWORD,
  database: process.env.MS_DB_SCHEMA
})

module.exports = pool
