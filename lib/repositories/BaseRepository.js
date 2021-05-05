const pool = require('../db/pool.js')

class BaseRepository {
  async query (sqlTemplate, params) {
    const connection = pool.promise()

    const sql = connection.format(sqlTemplate.split(/\s+/).join(' '), params)
    this.log(sql)

    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await connection.query(sql)

    return results
  }

  log (sql) {
    console.log(`[SQL] ${sql}`)
  }
}

module.exports = BaseRepository
