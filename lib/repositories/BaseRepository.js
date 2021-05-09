class BaseRepository {
  /**
   * コンストラクタ
   * @param {Connection} connection DBコネクション
   */
  constructor (connection) {
    this.connection = connection
  }

  /**
   * クエリを実行する。
   * @param {String} sqlTemplate SQL のテンプレート
   * @param {Array} params パラメータ
   * @returns 実行結果のレコード
   */
  async query (sqlTemplate, params) {
    const sql = this.connection.format(sqlTemplate.split(/\s+/).join(' '), params)
    console.log(`[SQL] ${sql}`)

    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await this.connection.query(sql)

    return results
  }
}

module.exports = BaseRepository
