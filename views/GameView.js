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

  get cells () {
    return this.game.field.rows
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
      cells: this.game.field.rows
    }
  }
}

module.exports = GameView
