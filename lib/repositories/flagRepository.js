const pool = require('../db/pool.js')

/**
 * flags テーブル操作
 *
 * テーブルへの保存方法はこのオブジェクトに定義
 */
const FlagRepository = {
  /**
   * Flag を登録する。
   * @returns 作成された Game
   */
  async create (gameId, point) {
    const connection = pool.promise()

    try {
      const record = {
        gameId: gameId,
        x: point.x,
        y: point.y
      }

      const sql = connection.format('INSERT IGNORE INTO `flags` SET ?', record)
      console.log(sql)

      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(sql)

      return record
    } catch (err) {
      console.error(err)
      return null
    }
  },

  async delete (gameId, point) {
    const connection = pool.promise()

    try {
      const sql = connection.format('DELETE IGNORE FROM `flags` WHERE gameId = ? AND x = ? AND y = ?', [gameId, point.x, point.y])
      console.log(sql)

      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(sql)
    } catch (err) {
      console.error(err)
      return null
    }
  }
}

module.exports = FlagRepository
