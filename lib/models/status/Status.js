const InitialStatus = require('./InitialStatus')
const PlayStatus = require('./PlayStatus')
const WinStatus = require('./WinStatus')
const LoseStatus = require('./LoseStatus')

const INIT = new InitialStatus()
const PLAY = new PlayStatus()
const WIN = new WinStatus()
const LOSE = new LoseStatus()

const values = {}
values[INIT.name] = INIT
values[PLAY.name] = PLAY
values[WIN.name] = WIN
values[LOSE.name] = LOSE

function parse (name) {
  return values[name]
}

module.exports = { INIT, PLAY, WIN, LOSE, parse }
