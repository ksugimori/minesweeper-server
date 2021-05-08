const BaseRepository = require('./BaseRepository')

/**
 * flags テーブル操作
 *
 * テーブルへの保存方法はこのオブジェクトに定義
 */
class FlagRepository extends BaseRepository {
  /**
   * Flag を登録する。
   */
  async create (gameId, point) {
    try {
      const record = {
        gameId: gameId,
        x: point.x,
        y: point.y
      }

      await this.query('INSERT INTO flags SET ?', record)

      return record
    } catch (err) {
      console.error(err)
      return null
    }
  }

  /**
   * フラグを削除する。
   */
  async delete (gameId, point) {
    try {
      await this.query('DELETE IGNORE FROM `flags` WHERE gameId = ? AND x = ? AND y = ?', [gameId, point.x, point.y])
    } catch (err) {
      console.error(err)
      return null
    }
  }
}

module.exports = new FlagRepository()
