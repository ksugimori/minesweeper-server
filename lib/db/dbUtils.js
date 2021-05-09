const pool = require('./pool.js')

async function doTransaction (func) {
  const connection = pool.promise()

  try {
    await connection.query('START TRANSACTION')

    const result = await func(connection)

    await connection.query('COMMIT')

    return result
  } catch (err) {
    await connection.query('ROLLBACK')
    throw err
  } finally {
    pool.releaseConnection(connection)
  }
}

module.exports = { doTransaction }
