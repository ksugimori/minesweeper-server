const Game = require('../../models/Game')
const random = require('../../models/util/random')

/**
 * Game オブジェクトを初期化する。
 *
 * 指定した場所に地雷がセットできるようになります。
 * @param {Number} width 幅
 * @param {Number} height 高さ
 * @param {Array} mines 地雷の座標
 */
module.exports.initGame = function (width, height, ...mines) {
  const game = new Game()

  const numMines = mines.length
  game.setting.merge({ width, height, numMines })

  // ランダムな地雷の配置はモックする
  const spy = jest.spyOn(random, 'points')
  spy.mockReturnValue(mines)

  game.initialize()

  return game
}
