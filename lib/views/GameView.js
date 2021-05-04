const CellView = require('./CellView')

/**
 * クライアントに返却する Game オブジェクトのラッパー。
 *
 * 出力するプロパティの制御などはこのクラスで行います。
 */
class GameView {
  constructor (game) {
    this.game = game
  }

  /**
   * Game オブジェクトから GameView を作成する
   * @param {Game} game ゲーム
   * @returns GameView
   */
  static wrap (game) {
    return new GameView(game)
  }

  /**
   * 地雷の座標のリスト
   *
   * ゲームが終了するまでは空配列を返します。
   */
  get mines () {
    if (this.game.status.isEnd) {
      return this.game.field.points(cell => cell.isMine)
    } else {
      return []
    }
  }

  /**
   * フラグの立っている座標のリスト
   */
  get flags () {
    return this.game.field.points(cell => cell.isFlag)
  }

  /**
   * 開いているセルのリスト
   */
  get openCells () {
    let filter = null
    if (!this.game.status.isEnd) {
      // ゲーム終了するまでは開かれたセルのみ
      filter = cell => cell.isOpen
    }

    return this.game.field.points(filter)
      .map(p => new CellView(p, this.game.field.cellAt(p)))
  }

  /**
   * クライアントに渡すためにJSONとしてシリアライズする。
   */
  toJSON () {
    return {
      id: this.game.id,
      width: this.game.setting.width,
      height: this.game.setting.height,
      numMines: this.game.setting.numMines,
      status: this.game.status.toJSON(),
      startTime: this.game.stopWatch.toJSON(),
      openCells: this.openCells,
      flags: this.flags,
      mines: this.mines
    }
  }
}

module.exports = GameView
