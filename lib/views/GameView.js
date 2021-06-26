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
   * セルの一覧を取得する。
   * @returns セルの一覧
   */
  _cells () {
    const all = this.game.field.rows.flat().map(cell => cell.clone())
    if (this.game.status.isEnd) {
      return all
    } else {
      // プレイ中は開いてないセルのカウントを 0 にする
      return all.map(cell => {
        if (!cell.isOpen) {
          cell.count = 0
        }
        cell.isMine = false
        return cell
      })
    }
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
      startTime: this.game.startTime,
      endTime: this.game.endTime,
      cells: this._cells()
    }
  }
}

module.exports = GameView
