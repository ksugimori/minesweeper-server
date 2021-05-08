const pool = require('../db/pool.js')

class BaseRepository {
  /**
   * コンストラクタ
   * @param {Connection} connection DBコネクション
   */
  constructor (connection) {
    this.connection = connection
  }

  async query (sqlTemplate, params) {
    const connection = pool.promise()

    const sql = connection.format(sqlTemplate.split(/\s+/).join(' '), params)
    console.log(`[SQL] ${sql}`)

    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await connection.query(sql)

    pool.releaseConnection(connection)

    return results
  }
}

module.exports = BaseRepository
