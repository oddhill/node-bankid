'use strict';

class BankIDError extends Error {
  constructor(message, code) {
    super(message);

    Error.captureStackTrace(this, this.constructor);

    this.name = 'BankIDError';
    this.message = message;
    this.code = code;
  }
}

module.exports = BankIDError;
