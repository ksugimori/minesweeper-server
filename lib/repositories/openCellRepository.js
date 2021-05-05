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
      await this.query('INSERT INTO `open_cells` (gameId, x, y) VALUES ?', [records])

      return records
    } catch (err) {
      console.error(err)
      return null
    }
  }
}

module.exports = new OpenCellRepository()
