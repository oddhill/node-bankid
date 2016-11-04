'use strict';

var helpers = require('./helpers');
var expect = require('chai').expect;
var BankIDService = require('../lib/BankIDService');
var BankIdError = require('../lib/BankIDError');

describe('BankID Service', function () {

  describe('createBankIDError', function () {

    it('should create a new BankIDError when the BankID API returns an error object', function () {
      var error = BankIDService.createBankIDError(helpers.simulateBankIDError());
      expect(error).to.be.instanceOf(BankIdError);
    });

    it('should return the initial error object if not a BankID error', function () {
      var notBankIdError = new Error('Not a BankID error');
      var error = BankIDService.createBankIDError(notBankIdError);
      expect(error).to.equal(notBankIdError);
    });
  });

  describe('isValidSSN', function () {

    it('should return true on a ssn with 12 digits', function () {
      expect(BankIDService.isValidSSN('199001011337')).to.equal(true);
    });

    it('should return false on a ssn that does not have 12 digits', function () {
      expect(BankIDService.isValidSSN('19900101')).to.equal(false);
      expect(BankIDService.isValidSSN('19900101133700')).to.equal(false);
    });
  });
});
