'use strict';

/**
 * Creates a mock error object that looks similar to an error recieved from
 * the BankID API.
 *
 * @return {object}
 */
exports.simulateBankIDError = function () {
  const error = new Error('Some error message');

  error.root = {
    Envelope: {
      Body: {
        Fault: {
          detail: {
            RpFault: {
              faultStatus: 'SOME_FAULT_STATUS',
              detailedDescription: 'Some detailed description',
            },
          },
        },
      },
    },
  };

  return error;
}
