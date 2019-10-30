'use strict';

// Require dependencies.
const fs = require('fs');
const path = require('path');

/**
 * Callback for the loadCertificateAuthority method.
 *
 * @callback loadCertificateAuthorityCallback
 * @param {Error|undefined} err - An error object if there was an error.
 * @param {string} - A string with the certificate or undefined if there was an error.
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
 * various things like validation of options etc.
 */
class BankID {
  /**
   * Helper method to check if the specified environment is test.
   *
   * @param {string} env
   */
  static isTestEnv(env) {
    return env === 'test';
  }

  /**
   * Helper method to check if the specified environment is production.
   *
   * @param {string} env
   */
  static isProductionEnv(env) {
    return env === 'production';
  }

  /**
   * Validate the supplied options.
   *
   * @param {object} options
   * @return {Error|null}
   */
  static validateOptions(options) {
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
  static loadCertificateAuthority(env, callback) {
    const filePath = path.join(__dirname, `../certs/bankid-${env}.cer`);
    fs.readFile(filePath, 'utf8', callback);
  }

  /**
   * Check if the current environment is valid.
   *
   * @param {string} env - A string defining the current environment.
   * @return {boolean}
   */
  static isValidEnvironment(env) {
    return ['production', 'test'].indexOf(env) > -1;
  }

  /**
   * Get the correct URL to the BankID API based on the specified environment.
   *
   * @param {string} env - A string defining the current environment.
   * @return {string} - The API-url for the current environment.
   */
  static buildBankIDApiUrl(env) {
    const uri = (env === 'production') ? 'appapi2.bankid.com' : 'appapi2.test.bankid.com';
    return `https://${uri}/rp/v5`;
  }

  /**
   * Load the SSL certificate.
   *
   * @param {string} path - Path to the ssl certificate.
   * @param {loadSSLCertificateCallback} callback - Called when the file has been loaded.
   */
  static loadSSLCertificate(path, callback) {
    fs.readFile(path, callback);
  }
}

module.exports = BankID;
