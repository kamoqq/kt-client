'use strict';

require('babel-polyfill');

import assert from 'power-assert';
import childProcess from 'child_process';

let exec = childProcess.exec;

import KyotoTocoon from '../index';

describe('kt-client', () => {
  describe('get test', () => {
    beforeEach((done) => {
      exec('ktremotemgr clear', () => {
        done();
      });
    });

    it('data', async (done) => {
      await new Promise((resolve) => {
        exec('ktremotemgr set test_key test_value', resolve);
      });

      let client = new KyotoTocoon();

      client.get('test_key', (error, value, expire) => {
        assert(value === 'test_value');
        assert(expire === null);
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('specify DB', async function(done) {
      await new Promise((resolve) => {
        exec('ktremotemgr set -db blue test_key test_value', resolve);
      });

      let client = new KyotoTocoon();
      let options = {
        db: 'blue'
      };

      client.get('test_key', options, (error, value, expire) => {
        assert(value === 'test_value');
        assert(expire === null);
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('utf-8 data', async function(done) {
      await new Promise((resolve) => {
        exec('ktremotemgr set test_key test_value', resolve);
      });

      let client = new KyotoTocoon();
      let options = {
        encoding: 'utf8'
      };

      client.get('test_key', options, (error, value, expire) => {
        assert(value === 'test_value');
        assert(expire === null);
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('binary data', async function(done) {
      await new Promise((resolve) => {
        exec('ktremotemgr set test_key binary', resolve);
      });

      let client = new KyotoTocoon();
      let options = {
        encoding: 'binary'
      };

      client.get('test_key', options, (error, value, expire) => {
        assert(Buffer.isBuffer(value));
        assert(expire === null);
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('data and expiration time', async function(done) {
      await new Promise((resolve) => {
        exec('ktremotemgr set -xt 300 test_key test_value', resolve);
      });

      let client = new KyotoTocoon();
      client.get('test_key', (error, value, expire) => {
        assert(value === 'test_value');
        assert(expire instanceof Date);
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('no data', function(done) {
      let client = new KyotoTocoon();
      client.get('test_key', (error, value, expire) => {
        assert(typeof value === 'undefined');
        assert(typeof expire === 'undefined');
        assert(error === 'No record was found');
        done();
      });
    });

    it('connection error', function(done) {
      let client = new KyotoTocoon({
        host: 'localhost',
        port: 9999
      });
      client.get('test_key', (error, value, expire) => {
        assert(typeof value === 'undefined');
        assert(typeof expire === 'undefined');
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('set test', function() {
    beforeEach((done) => {
      exec('ktremotemgr clear', () => {
        done();
      });
    });

    it('data', async function(done) {
      let client = new KyotoTocoon();
      await new Promise((resolve) => {
        client.set('test_key', 'test_value', (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      client.get('test_key', function(error, value, expire) {
        assert(value === 'test_value');
        assert(expire === null);
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('specify DB', async function(done) {
      let client = new KyotoTocoon();
      let options = {
        db: 'blue'
      };

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(typeof value === 'undefined');
          assert(typeof expire === 'undefined');
          assert(error).to.equal('No record was found');
          resolve();
        });
      });

      client.get('test_key', options, (error, value, expire) => {
        assert(value === 'test_value');
        assert(expire === null);
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('utf-8 data', async function(done) {
      let client = new KyotoTocoon();
      let options = {
        encoding: 'utf8'
      };

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      client.get('test_key', options, (error, value, expire) => {
        assert(value === 'test_value');
        assert(expire === null);
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('binary data', async function(done) {
      let client = new KyotoTocoon();
      let testValue = new Buffer('test_value');
      let options = {
        encoding: 'binary'
      };

      await new Promise((resolve) => {
        client.set('test_key', testValue, options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      client.get('test_key', options, (error, value, expire) => {
        assert(value.toString() === testValue.toString());
        assert(expire === null);
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('object data', async function(done) {
      let client = new KyotoTocoon();
      let testValue = {
        key: 'test_value'
      };

      await new Promise((resolve) => {
        client.set('test_key', testValue, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      client.get('test_key', (error, value, expire) => {
        assert.deepEqual(JSON.parse(value), testValue);
        assert(expire === null);
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('data and expiration time', async function(done) {
      let client = new KyotoTocoon();
      let options = {
        expire: 300
      };

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      client.get('test_key', (error, value, expire) => {
        assert(value === 'test_value');
        assert(expire instanceof Date);
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('connection error', function(done) {
      let client = new KyotoTocoon({
        host: 'localhost',
        port: 9999
      });

      client.set('test_key', 'test_value', (error) => {
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('add test', function() {
    beforeEach((done) => {
      exec('ktremotemgr clear', () => {
        done();
      });
    });

    it('data', async function(done) {
      let client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.add('test_key', 'test_value', (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      client.get('test_key', (error, value, expire) => {
        assert(value === 'test_value');
        assert(expire === null);
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('already exists', async function(done) {
      let client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key', 'foo', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.add('test_key', 'test_value', (error) => {
          assert(error === 'Connection error');
          resolve();
        });
      });

      client.get('test_key', (error, value) => {
        assert(value === 'foo');
        done();
      });
    });
  });

  describe('replace test', function() {
    beforeEach((done) => {
      exec('ktremotemgr clear', () => {
        done();
      });
    });

    it('data', async function(done) {
      let client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key', 'foo', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.replace('test_key', 'test_value', (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      client.get('test_key', (error, value) => {
        assert(value === 'test_value');
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('not exists', async function(done) {
      let client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key', 'foo', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.add('test_key', 'test_value', (error) => {
          assert(error === 'Connection error');
          resolve();
        });
      });

      client.get('test_key', (error, value) => {
        assert(value === 'foo');
        done();
      });
    });
  });

  describe('remove test', function() {
    beforeEach((done) => {
      exec('ktremotemgr clear', () => {
        done();
      });
    });

    it('data', async function(done) {
      let client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.get('test_key', (error, value) => {
          assert(value === 'test_value');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.remove('test_key', (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      client.get('test_key', (error, value) => {
        assert(typeof value === 'undefined');
        assert(error === 'No record was found');
        done();
      });
    });

    it('specify DB', async function(done) {
      let client = new KyotoTocoon();
      let options = {
        db: 'blue'
      };

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.get('test_key', options, (error, value) => {
          assert(value === 'test_value');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.remove('test_key', options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      client.get('test_key', options, (error, value) => {
        assert(typeof value === 'undefined');
        assert(error === 'No record was found');
        done();
      });
    });

    it('not exists', function(done) {
      let client = new KyotoTocoon();

      client.remove('test_key', (error) => {
        assert(error === 'No record was found');
        done();
      });
    });

    it('connection error', function(done) {
      let client = new KyotoTocoon({
        host: 'localhost',
        port: 9999
      });

      client.remove('test_key', (error) => {
        assert(error === 'Connection error');
        done();
      });
    });
  });
});
