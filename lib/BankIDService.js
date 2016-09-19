'use strict';

/**
 * The BankIDService class is used to make calls against the BankID API with a
 * pre-configured soap client.
 *
 * The service class contains a method for each endpoint that has not been
 * deprecated by BankID.
 */
class BankIDService {

  /**
   * BankIDService constructor.
   *
   * @param {object} client - The configured soap client that should be used
   * to make requests against the BankID API.
   */
  constructor (client) {
    this.client = client;
  }

  /**
   * Method to call the Authenticate resource on the BankID API.
   *
   * @param {object} args - An object containing the arguments to use when calling the API-resource.
   * @param {string} args.personalNumber - The soscia security number of the person to authenticate.
   * @param {function} callback
   */
  authenticate (args, callback) {
    if (args.personalNumber && !BankIDService.isValidSSN(args.personalNumber)) {
      return callback(new Error('The specified social security number must be 12 digits in length.'));
    }

    this.client.Authenticate(args, callback);
  }

  /**
   * Method to call the Collect resource on the BankID API.
   *
   * @param {string} orderRef - The orderRef to collect information about.
   */
  collect (orderRef, callback) {
    this.client.Collect(orderRef, callback);
  }

  /**
   * Method to call the Sign resource on the BankID API.
   *
   * @param {object} args - An object containing arguments to use when calling the API-resource.
   */
  sign (args, callback) {
    // Make sure the userVisibleData and userNonVisibleData is turned into Base64
    // strings before sending them to the API.
    if (args.userVisibleData) {
      args.userVisibleData = BankIDService.toBase64(args.userVisibleData);
    }

    if (args.userNonVisibleData) {
      args.userNonVisibleData = BankIDService.toBase64(args.userNonVisibleData);
    }

    this.client.Sign(args, callback);
  }

  /**
   * Helper method that transforms a string to Base64.
   *
   * @param {string} string - The string that should be transformed.
   * @return {string}
   */
  static toBase64 (string) {
    return new Buffer(string).toString('base64');
  }

  /**
   * Validates the length of a social security number and makes sure it's all
   * numbers.
   *
   * @param {string} string - The string to validate.
   * @param {boolean}
   */
  static isValidSSN (string) {
    return /^\d{12}$/.test(string);
  }
}

module.exports = BankIDService;
