/*global describe, it, before */
'use strict';

var chai = require('chai');
var exec = require('child_process').exec;

var KyotoTocoon = require('../index');

chai.should();

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
          value.should.equal('test_value');
          error.should.be.undefined;
          done();
        });
      });
    });
  });
});
