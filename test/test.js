/*global describe, it, beforeEach */
'use strict';

var expect = require('chai').expect;
var exec = require('child_process').exec;

var KyotoTocoon = require('../index');

describe('kt-client', function() {
  describe('get test', function() {
    beforeEach(function(done) {
      exec('ktremotemgr clear', function () {
        done();
      });
    });

    it('data', function(done) {
      exec('ktremotemgr set test_key test_value', function () {
        var client = new KyotoTocoon();
        client.get('test_key', function(error, value, expire) {
          expect(value).to.equal('test_value');
          expect(expire).to.be.null;
          expect(error).to.be.undefined;
          done();
        });
      });
    });
    
    it('data and expiration time', function(done) {
      exec('ktremotemgr set -xt 300 test_key test_value', function () {
        var client = new KyotoTocoon();
        client.get('test_key', function(error, value, expire) {
          expect(value).to.equal('test_value');
          expect(expire).to.be.undefined;
          done();
        });
      });
    });
  });
});
