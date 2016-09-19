// Require dependencies.
var assert = require('chai').assert;
var path = require('path');

// Require things to test.
var bankid = require('../lib/index');
var BankIDService = require('../lib/BankIDService');

describe('BankID Module', function () {
  // Create a valid options object that can be used by the tests.
  var options = {
    pfx: path.resolve('./certs/FPTestcert2_20150818_102329.pfx'),
    passphrase: 'qwerty123',
    env: 'test',
  };

  it('should return a configured instance of the BankIDService', function (done) {
    bankid(options, function (err, service) {
      if (err) return done(err);
      assert.instanceOf(service, BankIDService, 'The service variable should be an instance of BankIDService.');
      done();
    });
  });

  it('should return error on missing SSL certificate', function (done) {
    var customOptions = {
      passphrase: options.passphrase,
      env: options.env,
    };

    bankid(customOptions, function (err, options, service) {
      assert.instanceOf(err, Error, 'The options object must contain the path to a SSL certificate.');
      done();
    });
  });

  it('should return error on missing passphrase', function (done) {
    var customOptions = {
      pfx: options.pfx,
      env: options.env,
    };

    bankid(customOptions, function (err, options, service) {
      assert.instanceOf(err, Error, 'The options object must contain the path to a SSL certificate.');
      done();
    });
  });
});
