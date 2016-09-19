'use strict';

// Require dependencies.
const fs = require('fs');
const soap = require('soap');

/**
 * Callback for the createCLient method.
 *
 * @callback createClientCallback
 * @param {Error|null} err - An error object or null if no error.
 * @param {BankIDService|undefined} - A configured soap client or undefined if there was an error.
 */

/**
 * Callback for the loadCertificateAuthority method.
 *
 * @callback loadCertificateAuthorityCallback
 * @param {Error|undefined} err - An error object if there was an error.
 * @param {Buffer} - A file buffer with the certificate or undefined if there was an error.
 */

/**
 * Callback for the loadSSLCertificate method.
 *
 * @callback loadSSLCertificateCallback
 * @param {Error|undefined} err - An error object if there was an error.
 * @param {Buffer} - A file buffer with the SSL certificate or undefined if there was an error.
 */

/**
 * BankID utility class.
 *
 * This class only contains static utility methods that can be used for
 * various things like creating the soap client and validation of
 * options etc.
 */
class BankID {

  /**
   * Helper method to create the soap client needed to connect to the
   * BankID API.
   *
   * @param {object} options
   * @param {env} string
   * @param {createClientCallback} callback
   */
  static createClient (options, env, callback) {
    const url = BankID.buildBankIDApiUrl(env);

    soap.createClient(url, { wsdl_options: options }, (err, client) => {
      if (err) return callback(err);

      const securityOptions = {
        rejectUnauthorized: options.rejectUnauthorized
      };

      client.setSecurity(new soap.ClientSSLSecurityPFX(
        options.pfx,
        options.passphrase,
        securityOptions
      ));

      callback(null, client);
    });
  }

  /**
   * Helper method to check if the specified environment is test.
   *
   * @param {string} env
   */
  static isTestEnv (env) {
    return env === 'test';
  }

  /**
   * Helper method to check if the specified environment is production.
   *
   * @param {string} env
   */
  static isProductionEnv (env) {
    return env === 'production';
  }

  /**
   * Validate the supplied options.
   *
   * @param {object} options
   * @return {Error|null}
   */
  static validateOptions (options) {
    if (!options.pfx) {
      return new Error('A path to a SSL certificate in pfx format must be supplied with the options.');
    }

    if (!options.passphrase) {
      return new Error('A passphrase for the SSL certificate must be specified.');
    }

    if (options.env && !BankID.isValidEnvironment(options.env)) {
      return new Error(`The specified environment ${options.env} is not allowed. Allowed environments are production and test.`);
    }

    return null;
  }

  /**
   * Load certificate based on the current environment.
   *
   * @param {string} env - A string defining the current environment.
   * @param {loadCertificateAuthorityCallback} callback - Called when the certificate has been loaded.
   */
  static loadCertificateAuthority (env, callback) {
    const file = `../certs/bankid-${env}`;
    fs.readFile(file, callback);
  }

  /**
   * Check if the current environment is valid.
   *
   * @param {string} env - A string defining the current environment.
   * @return {boolean}
   */
  static isValidEnvironment (env) {
    return ['production', 'test'].indexOf(env) > -1;
  }

  /**
   * Get the correct URL to the BankID API based on the specified environment.
   *
   * @param {string} env - A string defining the current environment.
   * @return {string} - The API-url for the current environment.
   */
  static buildBankIDApiUrl (env) {
    const uri = (env === 'production') ? 'appapi.bankid.com' : 'appapi.test.bankid.com';
    return `https://${uri}/rp/v4?wsdl`;
  }

  /**
   * Load the SSL certificate.
   *
   * @param {string} path - Path to the ssl certificate.
   * @param {loadSSLCertificateCallback} callback - Called when the file has been loaded.
   */
  static loadSSLCertificate (path, callback) {
    fs.readFile(path, callback);
  }
}

module.exports = BankID;
