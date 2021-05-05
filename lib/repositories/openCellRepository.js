const BaseRepository = require('./BaseRepository')

/**
 * open_cells テーブル操作
 *
 * テーブルへの保存方法はこのオブジェクトに定義
 */
class OpenCellRepository extends BaseRepository {
  /**
   * openCell を登録する。
   */
  async createAll (gameId, points) {
    try {
      const records = points.map(p => [gameId, p.x, p.y])
      await this.query('INSERT INTO open_cells (gameId, x, y) VALUES ?', [records])

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

module.exports = new OpenCellRepository()
