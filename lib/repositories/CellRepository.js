const BaseRepository = require('./BaseRepository')

/**
 * cells テーブル操作
 *
 * テーブルへの保存方法はこのオブジェクトに定義
 */
class CellRepository extends BaseRepository {
  /**
   * インスタンス作成
   * @param {Connection} connection DBコネクション
   * @returns インスタンス
   */
  static from (connection) {
    return new CellRepository(connection)
  }

  /**
   * openCell を登録する。
   */
  async createAll (gameId, cells) {
    if (!(Array.isArray(cells) && cells.length > 0)) {
      return null
    }

    try {
      const records = cells.map(c => [gameId, c.x, c.y, c.count, c.isMine, c.isOpen, c.isFlag])
      await this.query('REPLACE INTO cells (gameId, x, y, count, isMine, isOpen, isFlag) VALUES ?', [records])

      return records
    } catch (err) {
      console.error(err)
      return null
    }
  }

  /**
   * 指定したレコードが存在するか？
   * @returns 存在する場合 true
   */
  async exists (gameId, point) {
    try {
      const results = await this.query('SELECT 1 FROM open_cells WHERE gameId = ? AND x = ? AND y = ?', [gameId, point.x, point.y])

      return results.length > 0
    } catch (err) {
      console.error(err)
      return false
    }
  }
}

module.exports = CellRepository
