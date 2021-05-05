const pool = require('../db/pool.js')

class BaseRepository {
  async query (sqlTemplate, params) {
    const connection = pool.promise()

    const sql = connection.format(sqlTemplate.split(/\s+/).join(' '), params)
    console.log(`[SQL] ${sql}`)

    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await connection.query(sql)

    return results
  }
}

module.exports = BaseRepository
