const InitialStatus = require('./InitialStatus')
const PlayStatus = require('./PlayStatus')
const WinStatus = require('./WinStatus')
const LoseStatus = require('./LoseStatus')

const INIT = new InitialStatus()
const PLAY = new PlayStatus()
const WIN = new WinStatus()
const LOSE = new LoseStatus()

module.exports = { INIT, PLAY, WIN, LOSE }
