const ArgumentErrorType = 'ArgumentError'

class ArgumentError extends Error {
  constructor(message) {
    super(message)
    this.type = ArgumentErrorType
  }
}

module.exports = {
  ArgumentError,
  ArgumentErrorType,
}
