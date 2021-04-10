const ApplicationException = require('./ApplicationException')

class BadRequestException extends ApplicationException {
  get statusCode () {
    return 400
  }
}

module.exports = BadRequestException
