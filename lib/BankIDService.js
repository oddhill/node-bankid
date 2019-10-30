'use strict';

const request = require('request');
const BankID = require('./BankID');
const BankIDError = require('./BankIDError');

/**
 * The BankIDService class is used to make calls against the BankID API.
 *
 * The service class contains a method for each endpoint that has not been
 * deprecated by BankID.
 */
class BankIDService {
  /**
   * BankIDService constructor.
   *
   * @param {object} options - Options needed for connecting to the BankID API.
   */
  constructor(options) {
    this.agentOptions = {
      ca: options.ca,
      pfx: options.pfx,
      passphrase: options.passphrase,
      securityOptions: 'SSL_OP_NO_SSLv3'
    };
    this.uri = BankID.buildBankIDApiUrl(options.env);
  }

  /**
   * Method to call the Authenticate resource on the BankID API.
   *
   * @param {object} args - An object containing the arguments to use when calling the API-resource.
   * @param {string} args.personalNumber - The social security number of the person to authenticate.
   * @param {string} args.endUserIp - The IP address of the person to authenticate.
   * @param {function} callback
   */
  authenticate(args, callback) {
    if (args.personalNumber && !BankIDService.isValidSSN(args.personalNumber)) {
      return callback(new Error('The specified social security number must be 12 digits in length.'));
    }

    if (args.endUserIp === undefined) {
      return callback(new Error('Missing end user IP address.'));
    }

    request.post(`${this.uri}/auth`, {
      agentOptions: this.agentOptions,
      json: {
        personalNumber: args.personalNumber,
        endUserIp: args.endUserIp
      }
    }, (err, res) => {
      if (err || res.body.errorCode) return callback(BankIDService.createBankIDError(err, res.body));
      callback(null, res.body);
    });
  }

  /**
   * Method to call the Cancel resource on the BankID API.
   *
   * @param {string} orderRef - The orderRef to cancel.
   */
  cancel(orderRef, callback) {
    request.post(`${this.uri}/cancel`, {
      agentOptions: this.agentOptions,
      json: {
        orderRef: orderRef
      }
    }, (err, res) => {
      if (err || res.body.errorCode) return callback(BankIDService.createBankIDError(err, res.body));
      callback(null, res.body);
    });
  }

  /**
   * Method to call the Collect resource on the BankID API.
   *
   * @param {string} orderRef - The orderRef to collect information about.
   */
  collect(orderRef, callback) {
    request.post(`${this.uri}/collect`, {
      agentOptions: this.agentOptions,
      json: {
        orderRef: orderRef
      }
    }, (err, res) => {
      if (err || res.body.errorCode) return callback(BankIDService.createBankIDError(err, res.body));
      callback(null, res.body);
    });
  }

  /**
   * Method to call the Sign resource on the BankID API.
   *
   * @param {object} args - An object containing arguments to use when calling the API-resource.
   */
  sign(args, callback) {
    if (args.personalNumber && !BankIDService.isValidSSN(args.personalNumber)) {
      return callback(new Error('The specified social security number must be 12 digits in length.'));
    }

    if (args.endUserIp === undefined) {
      return callback(new Error('Missing end user IP address.'));
    }

    // Make sure the userVisibleData and userNonVisibleData is turned into Base64
    // strings before sending them to the API.
    if (args.userVisibleData) {
      args.userVisibleData = BankIDService.toBase64(args.userVisibleData);
    }

    if (args.userNonVisibleData) {
      args.userNonVisibleData = BankIDService.toBase64(args.userNonVisibleData);
    }

    request.post(`${this.uri}/sign`, {
      agentOptions: this.agentOptions,
      json: {
        personalNumber: args.personalNumber,
        endUserIp: args.endUserIp,
        userVisibleData: args.userVisibleData,
        userNonVisibleData: args.userNonVisibleData
      }
    }, (err, res) => {
      if (err || res.body.errorCode) return callback(BankIDService.createBankIDError(err, res.body));
      callback(null, res.body);
    });
  }

  /**
   * Helper method that transforms a string to Base64.
   *
   * @param {string} string - The string that should be transformed.
   * @return {string}
   */
  static toBase64(string) {
    return Buffer.from(string).toString('base64');
  }

  /**
   * Validates the length of a social security number and makes sure it's all
   * numbers.
   *
   * @param {string} string - The string to validate.
   * @param {boolean}
   */
  static isValidSSN(string) {
    return /^\d{12}$/.test(string);
  }

  /**
   * Attempts to get the error details from a BankID error response.
   *
   * @param {object} body - The BankID response.
   * @return {mixed}
   */
  static getErrorDetails(body) {
    if (body.errorCode) {
      return body;
    }

    return false;
  }

  /**
   * Create a new BankIDError from the supplied error.
   *
   * @param {object} err - The error object.
   * @return {BankIDError}
   */
  static createBankIDError(err, body) {
    if (err) {
      return err;
    }

    return new BankIDError(body.details, body.errorCode);
  }
}

module.exports = BankIDService;
