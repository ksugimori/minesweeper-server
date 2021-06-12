const Game = require('../models/Game')
const StopWatch = require('../models/util/StopWatch')
const Field = require('../models/Field')
const Status = require('../models/status/Status')
const DataNotFoundException = require('../exceptions/DataNotFoundException')
const BaseRepository = require('./BaseRepository')

/**
 * games テーブル操作
 *
 * テーブルへの保存方法はこのオブジェクトに定義
 */
class GameRepository extends BaseRepository {
  /**
   * インスタンス作成
   * @param {Connection} connection DBコネクション
   * @returns インスタンス
   */
  static from (connection) {
    return new GameRepository(connection)
  }

  /**
   * Game を登録する。
   * @param {Game} game ゲーム
   * @returns 作成された Game
   */
  async create (game) {
    try {
      const record = this.toRecord(game)

      const results = await this.query('INSERT INTO `games` SET ?', record)

      // ID は自動採番されるのでここでセット
      game.id = results.insertId

      return game
    } catch (err) {
      console.error(err)
      return null
    }
  }

  /**
   * Game を取得する。
   *
   * 存在しない場合は DataNotFoundException が投げられます。
   * @param {Number} id ID
   * @returns Game
   */
  async get (id) {
    const records = await this.query(`
    SELECT g.id, g.width, g.height, g.numMines, g.startTime, g.status, 
      IF(COUNT(m.x) = 0, JSON_ARRAY(), JSON_ARRAYAGG(JSON_OBJECT('x', m.x, 'y', m.y))) as mines,
      IF(COUNT(o.x) = 0, JSON_ARRAY(), JSON_ARRAYAGG(JSON_OBJECT('x', o.x, 'y', o.y))) as opens,
      IF(COUNT(f.x) = 0, JSON_ARRAY(), JSON_ARRAYAGG(JSON_OBJECT('x', f.x, 'y', f.y))) as flags
    FROM games g
      LEFT JOIN mines      m ON m.gameId = g.id
      LEFT JOIN flags      f ON f.gameId = g.id
      LEFT JOIN open_cells o ON o.gameId = g.id
    WHERE g.id = ? HAVING g.id = ?`, [id, id])

    if (records[0]) {
      return this.restore(records[0])
    } else {
      throw new DataNotFoundException(`game id = ${id} not found.`)
    }
  }

  /**
   * Game.status を取得する。
   *
   * 存在しない場合は DataNotFoundException が投げられます。
   * @param {Number} id ID
   * @returns ステータス
   */
  async getStatus (id) {
    const records = await this.query('SELECT status FROM games WHERE id = ?', [id])

    if (records[0]) {
      return records[0].status
    } else {
      throw new DataNotFoundException(`game id = ${id} not found.`)
    }
  }

  /**
   * Game を更新する。
   * @param {Game} game ゲーム
   * @returns 更新後の Game
   */
  async update (game) {
    const record = this.toRecord(game)

    // id も入っているとUPDATEされてしまうので一応消しておく
    const id = record.id
    delete record.id

    // eslint-disable-next-line no-unused-vars
    const results = await this.query('UPDATE `games` SET ? WHERE id = ?', [record, id])

    // 削除していた id を戻す
    game.id = id

    return game
  }

  /**
   * ステータスを更新する。
   * @param {Game} game ゲーム
   */
  async updateStatus (game) {
    await this.query('UPDATE `games` SET status = ? WHERE id = ?', [game.status.toRecord(), game.id])
  }

  /**
   * 保存用のオブジェクトを出力する。
   */
  toRecord (game) {
    return {
      id: game.id,
      width: game.setting.width,
      height: game.setting.height,
      numMines: game.setting.numMines,
      startTime: game.stopWatch.toRecord(),
      status: game.status.toRecord()
    }
  }

  /**
   * 保存用のオブジェクトから元の状態を復元する。
   * @param {Object} record toRecord メソッドで出力されたデータ
   */
  restore (record) {
    const instance = new Game()

    instance.id = record.id

    instance.setting.width = record.width
    instance.setting.height = record.height
    instance.setting.numMines = record.numMines

    instance.stopWatch = new StopWatch(new Date(record.startTime).getTime())
    instance.status = Status.parse(record.status)

    instance.field = new Field(record.width, record.height)

    record.mines && record.mines.forEach(p => instance.field.cellAt(p).mine())
    record.opens && record.opens.forEach(p => instance.field.cellAt(p).open())
    record.flags && record.flags.forEach(p => instance.field.cellAt(p).flag())

    // 各マスの周囲の地雷数をカウントし、value にセットする。
    instance.field.points().forEach(p => {
      const cell = instance.field.cellAt(p)
      if (!cell.isMine) {
        cell.count = instance.field.pointsArround(p, c => c.isMine).length
      }
    })

    return instance
  }
}

module.exports = GameRepository
