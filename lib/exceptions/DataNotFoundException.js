const ApplicationException = require('./ApplicationException')

class DataNotFoundException extends ApplicationException {
  get statusCode () {
    return 404
  }
}

module.exports = DataNotFoundException
