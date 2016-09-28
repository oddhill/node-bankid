'use strict';

class BankIDError extends Error {
  constructor (message, status, description, extra) {
    super(message, extra);

    Error.captureStackTrace(this, this.constructor);

    this.name = 'BankIDError';
    this.message = message;
    this.status = status;
    this.description = description;

    if (extra) {
      this.extra = extra;
    }
  }
}

module.exports = BankIDError;
