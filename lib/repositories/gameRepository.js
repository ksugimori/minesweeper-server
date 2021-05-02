const Game = require('../models/Game')
const StopWatch = require('../models/util/StopWatch')
const Field = require('../models/Field')
const Status = require('../models/status/Status')
const pool = require('../db/pool.js')
const DataNotFoundException = require('../exceptions/DataNotFoundException')

/**
 * games テーブル操作
 *
 * テーブルへの保存方法はこのオブジェクトに定義
 */
const GameRepository = {
  /**
   * Game を登録する。
   * @param {Game} game ゲーム
   * @returns 作成された Game
   */
  async create (game) {
    const connection = pool.promise()

    try {
      const record = this.toRecord(game)

      const sql = connection.format('INSERT INTO `games` SET ?', record)
      console.log(sql)

      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(sql)

      // ID は自動採番されるのでここでセット
      game.id = results.insertId

      return game
    } catch (err) {
      console.error(err)
      return null
    }
  },

  /**
   * Game を取得する。
   *
   * 存在しない場合は DataNotFoundException が投げられます。
   * @param {Number} id ID
   * @returns Game
   */
  async get (id) {
    const connection = pool.promise()

    // eslint-disable-next-line no-unused-vars
    const [records, fields] = await connection.query('SELECT * FROM `games` WHERE id = ?', [id])

    if (records[0]) {
      return this.restore(records[0])
    } else {
      throw new DataNotFoundException(`game id = ${id} not found.`)
    }
  },

  /**
   * Game を更新する。
   * @param {Game} game ゲーム
   * @returns 更新後の Game
   */
  async update (game) {
    const connection = pool.promise()

    try {
      const record = this.toRecord(game)

      // id も入っているとUPDATEされてしまうので一応消しておく
      const id = record.id
      delete record.id

      const sql = connection.format('UPDATE `games` SET ? WHERE id = ?', [record, id])
      console.log(sql)

      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(sql)

      // 削除していた id を戻す
      game.id = id

      return game
    } catch (err) {
      console.error(err)
      return null
    }
  },

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
      status: game.status.toRecord(),
      mines: JSON.stringify(game.field.points(cell => cell.isMine)),
      opens: JSON.stringify(game.field.points(cell => cell.isOpen)),
      flags: JSON.stringify(game.field.points(cell => cell.isFlag))
    }
  },

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

    record.mines.forEach(p => instance.field.cellAt(p).mine())
    record.opens.forEach(p => instance.field.cellAt(p).open())
    record.flags.forEach(p => instance.field.cellAt(p).flag())

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
