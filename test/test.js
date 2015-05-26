/*global describe, it, before */
'use strict';

var expect = require('chai').expect;
var exec = require('child_process').exec;

var KyotoTocoon = require('../index');

describe('kt-client', function() {
  describe('get test', function() {
    var client;

    before(function(done) {
      client = new KyotoTocoon();
      exec('ktremotemgr clear', function () {
        done();
      });
    });

    it('should be done successfull', function(done) {
      exec('ktremotemgr set test_key test_value', function () {
        client.get('test_key', function(error, value) {
          expect(value).should.equal('test_value');
          expect(error).should.be.undefined;
          done();
        });
      });
    });
  });
});
