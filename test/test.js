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

    it('specify DB', async (done) => {
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

    it('utf-8 data', async (done) => {
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

    it('binary data', async (done) => {
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

    it('data and expiration time', async (done) => {
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

    it('no data', (done) => {
      let client = new KyotoTocoon();

      client.get('test_key', (error, value, expire) => {
        assert(typeof value === 'undefined');
        assert(typeof expire === 'undefined');
        assert(error === 'No record was found');
        done();
      });
    });

    it('connection error', (done) => {
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

  describe('set test', () => {
    beforeEach((done) => {
      exec('ktremotemgr clear', () => {
        done();
      });
    });

    it('data', async (done) => {
      let client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', (error) => {
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

    it('specify DB', async (done) => {
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
          assert(error === 'No record was found');
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

    it('utf-8 data', async (done) => {
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

    it('binary data', async (done) => {
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

    it('object data', async (done) => {
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

    it('data and expiration time', async (done) => {
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

    it('connection error', (done) => {
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

  describe('add test', () => {
    beforeEach((done) => {
      exec('ktremotemgr clear', () => {
        done();
      });
    });

    it('data', async (done) => {
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

    it('already exists', async (done) => {
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

  describe('replace test', () => {
    beforeEach((done) => {
      exec('ktremotemgr clear', () => {
        done();
      });
    });

    it('data', async (done) => {
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

    it('not exists', async (done) => {
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

  describe('remove test', () => {
    beforeEach((done) => {
      exec('ktremotemgr clear', () => {
        done();
      });
    });

    it('data', async (done) => {
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

    it('specify DB', async (done) => {
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

    it('not exists', (done) => {
      let client = new KyotoTocoon();

      client.remove('test_key', (error) => {
        assert(error === 'No record was found');
        done();
      });
    });

    it('connection error', (done) => {
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

  describe('report test', () => {
    beforeEach((done) => {
      exec('ktremotemgr clear', () => {
        done();
      });
    });

    it('success', (done) => {
      let client = new KyotoTocoon();

      client.report((error, data) => {
        assert(typeof data === 'object');
        assert(data.hasOwnProperty('db_total_count'));
        assert(data.db_total_count === '0');
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('connection error', (done) => {
      let client = new KyotoTocoon({
        host: 'localhost',
        port: 9999
      });

      client.report((error, data) => {
        assert(typeof data === 'undefined');
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('matchPrefix test', () => {
    beforeEach((done) => {
      exec('ktremotemgr clear', () => {
        done();
      });
    });

    it('match', async (done) => {
      let client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key1', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.set('test_key2', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.set('foo', 'test_value', () => {
          resolve();
        });
      });

      client.matchPrefix('test', (error, data) => {
        assert(data instanceof Array);
        assert(data.length === 2);
        assert(data.includes('test_key1'));
        assert(data.includes('test_key2'));
        assert(!data.includes('foo'));
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('match DB option', async (done) => {
      let client = new KyotoTocoon();

      await new Promise((resolve) => {
        let options = {
          db: 'blue'
        };
        client.set('test_key1', 'test_value', options, () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        let options = {
          db: 'red'
        };
        client.set('test_key2', 'test_value', options, () => {
          resolve();
        });
      });

      let options = {
        db: 'blue'
      };
      client.matchPrefix('test', options, (error, data) => {
        assert(data instanceof Array);
        assert(data.length === 1);
        assert(data.includes('test_key1'));
        assert(!data.includes('test_key2'));
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('match max option', async (done) => {
      let client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key1', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.set('test_key2', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.set('test_key3', 'test_value', () => {
          resolve();
        });
      });

      let options = {
        max: 2
      };
      client.matchPrefix('test', options, (error, data) => {
        assert(data instanceof Array);
        assert(data.length === 2);
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('no match', async (done) => {
      let client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key1', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.set('test_key2', 'test_value', () => {
          resolve();
        });
      });

      client.matchPrefix('foo', (error, data) => {
        assert(data instanceof Array);
        assert(data.length === 0);
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('connection error', (done) => {
      let client = new KyotoTocoon({
        host: 'localhost',
        port: 9999
      });

      client.matchPrefix('test', (error, data) => {
        assert(typeof data === 'undefined');
        assert(error === 'Connection error');
        done();
      });
    });
  });
});
