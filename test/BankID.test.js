'use strict';

var expect = require('chai').expect;
var BankID = require('../lib/BankID');

describe('BankID', function () {

  describe('loadCertificateAuthority', function () {

    it('should load the production ca', function (done) {
      BankID.loadCertificateAuthority('production', function (err, ca) {
        if (err) return done(err);
        expect(ca).to.be.a('string');
        done();
      });
    });

    it('should load the test ca', function (done) {
      BankID.loadCertificateAuthority('test', function (err, ca) {
        if (err) return done(err);
        expect(ca).to.be.a('string');
        done();
      });
    });
  });
});
