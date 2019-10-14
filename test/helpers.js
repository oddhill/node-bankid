'use strict';

/**
 * Creates a mock error object that looks similar to an error recieved from
 * the BankID API.
 *
 * @return {object}
 */
exports.simulateBankIDError = function () {
  const error = new Error('Some error message');

  error.errorCode = 'someErrorCode';
  error.details = 'Some error details';

  return error;
}
