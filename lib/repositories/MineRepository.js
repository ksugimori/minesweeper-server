const BaseRepository = require('./BaseRepository')

/**
 * mines テーブル操作
 *
 * テーブルへの保存方法はこのオブジェクトに定義
 */
class MineRepository extends BaseRepository {
  /**
   * インスタンス作成
   * @param {Connection} connection DBコネクション
   * @returns インスタンス
   */
  static from (connection) {
    return new MineRepository(connection)
  }

  /**
   * 地雷を登録する。
   * @param {Number} gameId ゲームID
   * @param {Array} points 座標のリスト
   * @returns
   */
  async createAll (gameId, points) {
    try {
      const records = points.map(p => [gameId, p.x, p.y])
      await this.query('INSERT INTO mines (gameId, x, y) VALUES ?', [records])

      return records
    } catch (err) {
      console.error(err)
      return null
    }
  }

  /**
   * 地雷をすべて削除する。
   * @param {Number} gameId ゲームID
   */
  async deleteAll (gameId) {
    try {
      await this.query('DELETE IGNORE FROM mines WHERE gameId = ? ', [gameId])
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = MineRepository
