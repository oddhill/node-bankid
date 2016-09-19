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

  BankID.loadSSLCertificate(options.pfx, (err, cert) => {
    if (err) return callback(err);

    const env = options.env || 'production';

    const wsdlOptions = {
      pfx: cert,
      passphrase: options.passphrase,
      rejectUnauthorized: BankID.isProductionEnv(env),
    };

    BankID.createClient(wsdlOptions, env, (err, client) => {
      if (err) return callback(err);
      callback(null, new BankIDService(client));
    });
  });
};
