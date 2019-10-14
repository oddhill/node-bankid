'use strict';

const BankID = require('./BankID');
const BankIDService = require('./BankIDService');

/**
 * Callback with the instantiated BankIDService.
 *
 * @callback bankIDServiceCallback
 * @param {Error|null} err - An error object or null if no error.
 * @param {BankIDService|undefined} - An instance of the BankIDService class if there were no errors.
 */

/**
 * Configures the client and create the BankID service.
 *
 * @param {object} options - An array of options to configure the soap client.
 * @param {bankIDServiceCallback} callback - Callback that is run when the client and service has been created.
 */
module.exports = (options, callback) => {
  const optionsError = BankID.validateOptions(options);

  if (optionsError instanceof Error) {
    return callback(optionsError);
  }

  const env = options.env || 'production';

  BankID.loadCertificateAuthority(env, (err, ca) => {
    if (err) return callback(err);

    BankID.loadSSLCertificate(options.pfx, (err, cert) => {
      if (err) return callback(err);

      const serviceOptions = {
        env,
        ca: ca,
        pfx: cert,
        passphrase: options.passphrase,
      };

      callback(null, new BankIDService(serviceOptions));
    });
  });
};
