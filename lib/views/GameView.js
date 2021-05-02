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
   * フラグの立っている座標のリスト
   */
  get flags () {
    return this.game.field.points(cell => cell.isFlag)
  }

  /**
   * 開いているセルのリスト
   */
  get openCells () {
    return this.game.field.points(cell => cell.isOpen)
      .map(p => new CellView(p, this.game.field.cellAt(p)))
  }

  /**
   * セル一覧
   */
  get cells () {
    const conv = (cell) => {
      return {
        isMine: this.game.status.isEnd && cell.isMine,
        isOpen: cell.isOpen,
        isFlag: cell.isFlag,
        count: cell.isOpen ? cell.count : 0
      }
    }

    return this.game.field.rows.map(row => row.map(conv))
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
      cells: this.cells,
      openCells: this.openCells,
      flags: this.flags
    }
  }
}

module.exports = GameView
