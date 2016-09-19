// Require dependencies.
var assert = require('chai').assert;
var sinon = require('sinon');
var soapStub = require('soap/soap-stub');

// Require things to test.
var BankID = require('../lib/BankID');
var BankIDService = require('../lib/BankIDService');

// Create the test client stub.
var clientStub = {
  Authenticate: sinon.stub(),
  Collect: sinon.stub(),
  Sign: sinon.stub(),
};

clientStub.Authenticate.respondWithError = soapStub.createRespondingStub({});

soapStub.registerClient('BankID Stub Client', BankID.buildBankIDApiUrl('test'), clientStub);

describe('BankID Service', function () {
  var clientStub;
  var service;

  beforeEach(function () {
    clientStub = soapStub.getStub('BankID Stub Client');
    soapStub.reset();
    service = new BankIDService(clientStub);
  });

  it('should handle error responses', function (done) {
    clientStub.Authenticate.respondWithError();
    service.authenticate({}, done);
  });
});
