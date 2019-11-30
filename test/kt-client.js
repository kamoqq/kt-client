import test from 'ava';

import KyotoTocoon from '../index';

async function clear() {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.clear({ db: 'red' }, resolve);
  });

  await new Promise((resolve) => {
    client.clear({ db: 'blue' }, resolve);
  });

  return new Promise((resolve) => {
    client.clear(resolve);
  });
}

test.beforeEach(async () => {
  clear();
});

test.serial('[get] data', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', resolve);
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, 'test_value');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[get] specify DB', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    db: 'blue',
  };

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', options, resolve);
  });

  return new Promise((resolve) => {
    client.get('test_key', options, (error, value, expire) => {
      t.is(value, 'test_value');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[get] utf-8 data', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    encoding: 'utf8',
  };

  await new Promise((resolve) => {
    client.set('test_key', '京都🍁', resolve);
  });

  return new Promise((resolve) => {
    client.get('test_key', options, (error, value, expire) => {
      t.is(value, '京都🍁');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[get] binary data', async (t) => {
  const client = new KyotoTocoon();
  const testValue = Buffer.from('test_value');
  const options = {
    encoding: 'binary',
  };

  await new Promise((resolve) => {
    client.set('test_key', testValue, options, resolve);
  });

  return new Promise((resolve) => {
    client.get('test_key', options, (error, value, expire) => {
      t.assert(Buffer.isBuffer(value));
      t.is(value.toString(), 'test_value');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[get] data and expiration time', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    expire: 300,
  };

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', options, resolve);
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, 'test_value');
      t.assert(expire instanceof Date);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[get] no data', async (t) => {
  const client = new KyotoTocoon();

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, undefined);
      t.is(expire, undefined);
      t.is(error, 'No record was found');
      resolve();
    });
  });
});

test.serial('[get] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, undefined);
      t.is(expire, undefined);
      t.is(error, 'Connection error');
      resolve();
    });
  });
});

test.serial('[set] data', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, 'test_value');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[set] number', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('test_key', 1, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, '1');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[set] specify DB', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    db: 'blue',
  };

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, undefined);
      t.is(expire, undefined);
      t.is(error, 'No record was found');
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', options, (error, value, expire) => {
      t.is(value, 'test_value');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[set] utf-8 data', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    encoding: 'utf8',
  };

  await new Promise((resolve) => {
    client.set('test_key', '京都🍁', options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', options, (error, value, expire) => {
      t.is(value, '京都🍁');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[set] binary data', async (t) => {
  const client = new KyotoTocoon();
  const testValue = Buffer.from('test_value');
  const options = {
    encoding: 'binary',
  };

  await new Promise((resolve) => {
    client.set('test_key', testValue, options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', options, (error, value, expire) => {
      t.is(value.toString(), testValue.toString());
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[set] object data', async (t) => {
  const client = new KyotoTocoon();
  const testValue = {
    key: 'test_value',
  };

  await new Promise((resolve) => {
    client.set('test_key', testValue, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.deepEqual(JSON.parse(value), testValue);
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[set] data and expiration time', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    expire: 300,
  };

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, 'test_value');
      t.assert(expire instanceof Date);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[set] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.set('test_key', 'test_value', (error) => {
      t.is(error, 'Connection error');
      resolve();
    });
  });
});

test.serial('[add] data', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.add('test_key', 'test_value', (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, 'test_value');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[add] data', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.add('test_key', 'test_value', (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, 'test_value');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[add] already exists', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('test_key', 'foo', () => {
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.add('test_key', 'test_value', (error) => {
      t.is(error, 'Connection error');
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value) => {
      t.is(value, 'foo');
      resolve();
    });
  });
});

test.serial('[replace] data', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('test_key', 'foo', () => {
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.replace('test_key', 'test_value', (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value) => {
      t.is(value, 'test_value');
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[replace] not exists', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('test_key', 'foo', () => {
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.add('test_key', 'test_value', (error) => {
      t.is(error, 'Connection error');
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value) => {
      t.is(value, 'foo');
      resolve();
    });
  });
});

test.serial('[remove] data', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', () => {
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.get('test_key', (error, value) => {
      t.is(value, 'test_value');
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.remove('test_key', (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value) => {
      t.is(value, undefined);
      t.is(error, 'No record was found');
      resolve();
    });
  });
});

test.serial('[remove] specify DB', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    db: 'blue',
  };

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.get('test_key', options, (error, value) => {
      t.is(value, 'test_value');
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.remove('test_key', options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', options, (error, value) => {
      t.is(value, undefined);
      t.is(error, 'No record was found');
      resolve();
    });
  });
});

test.serial('[remove] not exists', async (t) => {
  const client = new KyotoTocoon();

  return new Promise((resolve) => {
    client.remove('test_key', (error) => {
      t.is(error, 'No record was found');
      resolve();
    });
  });
});

test.serial('[remove] connection error', async (t) => {
  const client = new KyotoTocoon();

  return new Promise((resolve) => {
    client.remove('test_key', (error) => {
      t.is(error, 'No record was found');
      resolve();
    });
  });
});

test.serial('[void] success', async (t) => {
  const client = new KyotoTocoon();

  return new Promise((resolve) => {
    client.void((error) => {
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[void] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.void((error) => {
      t.is(error, 'Connection error');
      resolve();
    });
  });
});

test.serial('[echo] success', async (t) => {
  const client = new KyotoTocoon();

  return new Promise((resolve) => {
    client.echo({ foo: 'bar' }, (error, ret) => {
      t.assert(typeof ret.foo !== 'undefined');
      t.is(ret.foo, 'bar');
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[echo] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.echo({ foo: 'bar' }, (error) => {
      t.is(error, 'Connection error');
      resolve();
    });
  });
});

test.serial('[report] success', async (t) => {
  const client = new KyotoTocoon();

  return new Promise((resolve) => {
    client.report((error, data) => {
      t.assert(typeof data === 'object');
      t.assert(Object.prototype.hasOwnProperty.call(data, 'conf_os_name'));
      t.is(data.conf_os_name, 'Linux');
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[report] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.report((error, data) => {
      t.is(data, undefined);
      t.is(error, 'Connection error');
      resolve();
    });
  });
});

test.serial('[status] status', async (t) => {
  const client = new KyotoTocoon();

  return new Promise((resolve) => {
    client.status((error, data) => {
      t.assert(typeof data === 'object');
      t.assert(Object.keys(data).length > 0);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[status] specify DB', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    db: 'blue',
  };

  return new Promise((resolve) => {
    client.status(options, (error, data) => {
      t.assert(typeof data === 'object');
      t.assert(Object.keys(data).length > 0);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[status] no such DB', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    db: 'green',
  };

  return new Promise((resolve) => {
    client.status(options, (error, data) => {
      t.is(data, undefined);
      t.is(error, 'Bad request');
      resolve();
    });
  });
});

test.serial('[status] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.status((error, data) => {
      t.is(data, undefined);
      t.is(error, 'Connection error');
      resolve();
    });
  });
});


test.serial('[status] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.status((error, data) => {
      t.is(data, undefined);
      t.is(error, 'Connection error');
      resolve();
    });
  });
});

test.serial('[clear] clear', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', resolve);
  });

  await new Promise((resolve) => {
    client.get('test_key', (error, value) => {
      t.is(value, 'test_value');
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.clear((error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value) => {
      t.is(value, undefined);
      t.is(error, 'No record was found');
      resolve();
    });
  });
});

test.serial('[clear] specify DB', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    db: 'blue',
  };

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.get('test_key', options, (error, value) => {
      t.is(value, 'test_value');
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.clear(options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', options, (error, value) => {
      t.is(value, undefined);
      t.is(error, 'No record was found');
      resolve();
    });
  });
});

test.serial('[clear] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.clear((error) => {
      t.is(error, 'Connection error');
      resolve();
    });
  });
});

test.serial('[append] append', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.append('test_key', 'test_value', (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, 'test_value');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.append('test_key', 'test_value', (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, 'test_valuetest_value');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[append] specify DB', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    db: 'blue',
  };

  await new Promise((resolve) => {
    client.append('test_key', 'test_value', options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.get('test_key', options, (error, value, expire) => {
      t.is(value, 'test_value');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.append('test_key', 'test_value', options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, undefined);
      t.is(expire, undefined);
      t.is(error, 'No record was found');
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', options, (error, value, expire) => {
      t.is(value, 'test_valuetest_value');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[append] expiration time', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    expire: 300,
  };

  await new Promise((resolve) => {
    client.append('test_key', 'test_value', options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, 'test_value');
      t.assert(expire instanceof Date);
      t.is(error, undefined);
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.append('test_key', 'test_value', options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', options, (error, value, expire) => {
      t.is(value, 'test_valuetest_value');
      t.assert(expire instanceof Date);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[append] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.append('test_key', 'test_value', (error) => {
      t.is(error, 'Connection error');
      resolve();
    });
  });
});

test.serial('[increment] increment', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.increment('test_key', 1, (error, num) => {
      t.is(num, 1);
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.increment('test_key', 1, (error, num) => {
      t.is(num, 2);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[increment] with origin number', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    orig: 10,
  };

  await new Promise((resolve) => {
    client.increment('test_key', 1, options, (error, num) => {
      t.is(num, 11);
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.increment('test_key', 1, options, (error, num) => {
      t.is(num, 12);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[increment] specify DB', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    db: 'blue',
  };

  await new Promise((resolve) => {
    client.increment('test_key', 1, options, (error, num) => {
      t.is(num, 1);
      t.is(error, undefined);
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.increment('test_key', 1, options, (error, num) => {
      t.is(num, 2);
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, undefined);
      t.is(expire, undefined);
      t.is(error, 'No record was found');
      resolve();
    });
  });
});

test.serial('[increment] expiration time', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    expire: 300,
  };

  await new Promise((resolve) => {
    client.increment('test_key', 1, options, (error, num) => {
      t.is(num, 1);
      t.is(error, undefined);
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.assert(typeof value !== 'undefined');
      t.assert(expire instanceof Date);
      t.is(error, undefined);
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.increment('test_key', 1, options, (error, num) => {
      t.is(num, 2);
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.assert(typeof value !== 'undefined');
      t.assert(expire instanceof Date);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[increment] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.increment('test_key', 1, (error) => {
      t.is(error, 'Connection error');
      resolve();
    });
  });
});

test.serial('[incrementDouble] incrementDouble', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.incrementDouble('test_key', 0.1, (error, num) => {
      t.is(num, 0.1);
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.incrementDouble('test_key', 0.1, (error, num) => {
      t.is(num, 0.2);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[incrementDouble] with origin number', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    orig: 10,
  };

  await new Promise((resolve) => {
    client.incrementDouble('test_key', 0.1, options, (error, num) => {
      t.is(num, 10.1);
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.incrementDouble('test_key', 0.1, options, (error, num) => {
      t.is(num, 10.2);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[incrementDouble] specify DB', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    db: 'blue',
  };

  await new Promise((resolve) => {
    client.incrementDouble('test_key', 0.1, options, (error, num) => {
      t.is(num, 0.1);
      t.is(error, undefined);
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.incrementDouble('test_key', 0.1, options, (error, num) => {
      t.is(num, 0.2);
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, undefined);
      t.is(expire, undefined);
      t.is(error, 'No record was found');
      resolve();
    });
  });
});

test.serial('[incrementDouble] expiration time', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    expire: 300,
  };

  await new Promise((resolve) => {
    client.incrementDouble('test_key', 0.1, options, (error, num) => {
      t.is(num, 0.1);
      t.is(error, undefined);
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.assert(typeof value !== 'undefined');
      t.assert(expire instanceof Date);
      t.is(error, undefined);
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.incrementDouble('test_key', 0.1, options, (error, num) => {
      t.is(num, 0.2);
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(typeof value !== 'undefined');
      t.assert(expire instanceof Date);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[incrementDouble] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.incrementDouble('test_key', 0.1, (error, num) => {
      t.is(num, undefined);
      t.is(error, 'Connection error');
      resolve();
    });
  });
});

test.serial('[cas] swap', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', resolve);
  });

  await new Promise((resolve) => {
    client.cas('test_key', 'test_value', 'new_value', (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, 'new_value');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[cas] no old value', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', resolve);
  });

  await new Promise((resolve) => {
    client.cas('test_key', 'test_value', 'new_value', (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, 'new_value');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[cas] no new value', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', resolve);
  });

  await new Promise((resolve) => {
    client.cas('test_key', 'test_value', undefined, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, undefined);
      t.is(expire, undefined);
      t.is(error, 'No record was found');
      resolve();
    });
  });
});

test.serial('[cas] difference', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', resolve);
  });

  await new Promise((resolve) => {
    client.cas('test_key', 'difference_value', 'new_value', (error) => {
      t.is(error, 'The old value assumption was failed');
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, 'test_value');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[cas] specify DB', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    db: 'blue',
  };

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', options, resolve);
  });

  await new Promise((resolve) => {
    client.cas('test_key', 'test_value', 'new_value', options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', options, (error, value, expire) => {
      t.is(value, 'new_value');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[cas] expiration', async (t) => {
  const client = new KyotoTocoon();

  const options = {
    expire: 300,
  };

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', options, resolve);
  });

  await new Promise((resolve) => {
    client.cas('test_key', 'test_value', 'new_value', options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, value, expire) => {
      t.is(value, 'new_value');
      t.assert(expire instanceof Date);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[cas] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.cas('test_key', 'test_value', 'new_value', (error) => {
      t.is(error, 'Connection error');
      resolve();
    });
  });
});

test.serial('[check] check', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', resolve);
  });

  return new Promise((resolve) => {
    client.check('test_key', (error, size, expire) => {
      t.assert(typeof size === 'number');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[check] and expiration time', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    expire: 300,
  };

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', options, resolve);
  });

  return new Promise((resolve) => {
    client.check('test_key', (error, size, expire) => {
      t.assert(typeof size === 'number');
      t.assert(expire instanceof Date);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[check] specify DB', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    db: 'blue',
  };

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', options, resolve);
  });

  return new Promise((resolve) => {
    client.check('test_key', options, (error, size, expire) => {
      t.assert(typeof size === 'number');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[check] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.check('test_key', (error) => {
      t.is(error, 'Connection error');
      resolve();
    });
  });
});

test.serial('[seize] seize', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', resolve);
  });

  await new Promise((resolve) => {
    client.seize('test_key', (error, data, expire) => {
      t.is(data, 'test_value');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, data, expire) => {
      t.is(data, undefined);
      t.is(expire, undefined);
      t.is(error, 'No record was found');
      resolve();
    });
  });
});

test.serial('[seize] and expiration time', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    expire: 300,
  };

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', options, resolve);
  });

  await new Promise((resolve) => {
    client.seize('test_key', options, (error, data, expire) => {
      t.is(data, 'test_value');
      t.assert(expire instanceof Date);
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, data, expire) => {
      t.is(data, undefined);
      t.is(expire, undefined);
      t.is(error, 'No record was found');
      resolve();
    });
  });
});

test.serial('[seize] specify DB', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    db: 'blue',
  };

  await new Promise((resolve) => {
    client.set('test_key', 'test_value', options, resolve);
  });

  await new Promise((resolve) => {
    client.seize('test_key', options, (error, data, expire) => {
      t.is(data, 'test_value');
      t.is(expire, undefined);
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.get('test_key', (error, data, expire) => {
      t.is(data, undefined);
      t.is(expire, undefined);
      t.is(error, 'No record was found');
      resolve();
    });
  });
});

test.serial('[seize] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.check('test_key', (error) => {
      t.is(error, 'Connection error');
      resolve();
    });
  });
});

test.serial('[setBulk] data', async (t) => {
  const client = new KyotoTocoon();
  const testData = {
    test_key1: 'test_value1',
    test_key2: 'test_value2',
  };

  await new Promise((resolve) => {
    client.setBulk(testData, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.getBulk(Object.keys(testData), (error, ret) => {
      t.is(ret.test_key1, 'test_value1');
      t.is(ret.test_key2, 'test_value2');
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[setBulk] specify DB', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    db: 'blue',
  };
  const testData = {
    test_key1: 'test_value1',
    test_key2: 'test_value2',
  };

  await new Promise((resolve) => {
    client.setBulk(testData, options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.getBulk(Object.keys(testData), options, (error, ret) => {
      t.is(ret.test_key1, 'test_value1');
      t.is(ret.test_key2, 'test_value2');
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[setBulk] atomic', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    atomic: true,
  };
  const testData = {
    test_key1: 'test_value1',
    test_key2: 'test_value2',
  };

  await new Promise((resolve) => {
    client.setBulk(testData, options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.getBulk(Object.keys(testData), options, (error, ret) => {
      t.is(ret.test_key1, 'test_value1');
      t.is(ret.test_key2, 'test_value2');
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[setBulk] utf-8 data', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    encoding: 'utf8',
  };
  const testData = {
    test_key1: '京都🍁',
    test_key2: '東京🗼',
  };

  await new Promise((resolve) => {
    client.setBulk(testData, options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.getBulk(Object.keys(testData), options, (error, ret) => {
      t.is(ret.test_key1, '京都🍁');
      t.is(ret.test_key2, '東京🗼');
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[setBulk] binary data', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    encoding: 'binary',
  };
  const testData = {
    test_key1: Buffer.from([1, 2, 3]),
    test_key2: Buffer.from([4, 5, 6]),
  };

  await new Promise((resolve) => {
    client.setBulk(testData, options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.getBulk(Object.keys(testData), options, (error, ret) => {
      t.assert(Buffer.isBuffer(ret.test_key1));
      t.assert(Buffer.isBuffer(ret.test_key2));
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[setBulk] object data', async (t) => {
  const client = new KyotoTocoon();
  const testData = {
    test_key1: { a: 'b' },
    test_key2: { c: 'd' },
  };

  await new Promise((resolve) => {
    client.setBulk(testData, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.getBulk(Object.keys(testData), (error, ret) => {
      t.deepEqual(JSON.parse(ret.test_key1), testData.test_key1);
      t.deepEqual(JSON.parse(ret.test_key2), testData.test_key2);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[setBulk] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });
  const testData = {
    test_key1: 'test_value1',
    test_key2: 'test_value2',
  };

  return new Promise((resolve) => {
    client.setBulk(testData, (error) => {
      t.is(error, 'Connection error');
      resolve();
    });
  });
});

test.serial('[removeBulk] data', async (t) => {
  const client = new KyotoTocoon();
  const testData = {
    test_key1: 'test_value1',
    test_key2: 'test_value2',
  };

  await new Promise((resolve) => {
    client.setBulk(testData, () => {
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.getBulk(Object.keys(testData), (error, ret) => {
      t.is(ret.test_key1, 'test_value1');
      t.is(ret.test_key2, 'test_value2');
      t.is(error, undefined);
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.removeBulk(Object.keys(testData), (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.getBulk(Object.keys(testData), (error, ret) => {
      t.is(ret.test_key1, undefined);
      t.is(ret.test_key2, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[removeBulk] specify DB', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    db: 'blue',
  };
  const testData = {
    test_key1: 'test_value1',
    test_key2: 'test_value2',
  };

  await new Promise((resolve) => {
    client.setBulk(testData, options, () => {
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.getBulk(Object.keys(testData), options, (error, ret) => {
      t.is(ret.test_key1, 'test_value1');
      t.is(ret.test_key2, 'test_value2');
      t.is(error, undefined);
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.removeBulk(Object.keys(testData), options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.getBulk(Object.keys(testData), options, (error, ret) => {
      t.is(ret.test_key1, undefined);
      t.is(ret.test_key2, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[removeBulk] atomic', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    atomic: true,
  };
  const testData = {
    test_key1: 'test_value1',
    test_key2: 'test_value2',
  };

  await new Promise((resolve) => {
    client.setBulk(testData, options, () => {
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.getBulk(Object.keys(testData), options, (error, ret) => {
      t.is(ret.test_key1, 'test_value1');
      t.is(ret.test_key2, 'test_value2');
      t.is(error, undefined);
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.removeBulk(Object.keys(testData), options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });

  return new Promise((resolve) => {
    client.getBulk(Object.keys(testData), options, (error, ret) => {
      t.is(ret.test_key1, undefined);
      t.is(ret.test_key2, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[removeBulk] not exists', async (t) => {
  const client = new KyotoTocoon();

  return new Promise((resolve) => {
    client.removeBulk(['test_key1', 'test_key2'], (error) => {
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[removeBulk] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.removeBulk(['test_key1', 'test_key2'], (error) => {
      t.is(error, 'Connection error');
      resolve();
    });
  });
});

test.serial('[getBulk] getBulk', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('test_key1', 'test_value1', resolve);
  });

  await new Promise((resolve) => {
    client.set('test_key2', 'test_value2', resolve);
  });

  return new Promise((resolve) => {
    client.getBulk(['test_key1', 'test_key2'], (error, ret) => {
      t.is(ret.test_key1, 'test_value1');
      t.is(ret.test_key2, 'test_value2');
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[getBulk] specify DB', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    db: 'blue',
  };

  await new Promise((resolve) => {
    client.set('test_key1', 'test_value1', options, resolve);
  });

  await new Promise((resolve) => {
    client.set('test_key2', 'test_value2', options, resolve);
  });

  return new Promise((resolve) => {
    client.getBulk(['test_key1', 'test_key2'], options, (error, ret) => {
      t.is(ret.test_key1, 'test_value1');
      t.is(ret.test_key2, 'test_value2');
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[getBulk] atomic', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    atomic: true,
  };

  await new Promise((resolve) => {
    client.set('test_key1', 'test_value1', options, resolve);
  });

  await new Promise((resolve) => {
    client.set('test_key2', 'test_value2', options, resolve);
  });

  return new Promise((resolve) => {
    client.getBulk(['test_key1', 'test_key2'], options, (error, ret) => {
      t.is(ret.test_key1, 'test_value1');
      t.is(ret.test_key2, 'test_value2');
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[getBulk] utf-8 data', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    encoding: 'utf8',
  };

  await new Promise((resolve) => {
    client.set('test_key1', '京都🍁', options, resolve);
  });

  await new Promise((resolve) => {
    client.set('test_key2', '東京🗼', options, resolve);
  });

  return new Promise((resolve) => {
    client.getBulk(['test_key1', 'test_key2'], options, (error, ret) => {
      t.is(ret.test_key1, '京都🍁');
      t.is(ret.test_key2, '東京🗼');
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[getBulk] binary data', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    encoding: 'binary',
  };

  await new Promise((resolve) => {
    client.set('test_key1', Buffer.from([1, 2, 3]), options, resolve);
  });

  await new Promise((resolve) => {
    client.set('test_key2', Buffer.from([4, 5, 6]), options, resolve);
  });

  return new Promise((resolve) => {
    client.getBulk(['test_key1', 'test_key2'], options, (error, ret) => {
      t.assert(Buffer.isBuffer(ret.test_key1));
      t.assert(Buffer.isBuffer(ret.test_key2));
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[getBulk] no data', async (t) => {
  const client = new KyotoTocoon();

  return new Promise((resolve) => {
    client.getBulk(['test_key'], (error, ret) => {
      t.is(ret.test_key, undefined);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[getBulk] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.getBulk(['test_key'], (error, ret) => {
      t.is(ret, undefined);
      t.is(error, 'Connection error');
      resolve();
    });
  });
});

test.serial('[vacuum] vacuum', async (t) => {
  const client = new KyotoTocoon();

  return new Promise((resolve) => {
    client.vacuum((error) => {
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[vacuum] specify DB', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    db: 'blue',
  };

  return new Promise((resolve) => {
    client.vacuum(options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[vacuum] step option', async (t) => {
  const client = new KyotoTocoon();
  const options = {
    step: 10,
  };

  return new Promise((resolve) => {
    client.vacuum(options, (error) => {
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[vacuum] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.vacuum((error) => {
      t.is(error, 'Connection error');
      resolve();
    });
  });
});

test.serial('[matchPrefix] match', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('test_key1', 'test_value', resolve);
  });

  await new Promise((resolve) => {
    client.set('test_key2', 'test_value', resolve);
  });

  await new Promise((resolve) => {
    client.set('foo', 'test_value', resolve);
  });

  return new Promise((resolve) => {
    client.matchPrefix('test', (error, data) => {
      t.assert(data instanceof Array);
      t.is(data.length, 2);
      t.assert(data.includes('test_key1'));
      t.assert(data.includes('test_key2'));
      t.assert(!data.includes('foo'));
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[matchPrefix] match DB option', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('test_key1', 'test_value', { db: 'blue' }, resolve);
  });

  await new Promise((resolve) => {
    client.set('test_key2', 'test_value', { db: 'red' }, resolve);
  });

  return new Promise((resolve) => {
    client.matchPrefix('test', { db: 'blue' }, (error, data) => {
      t.assert(data instanceof Array);
      t.is(data.length, 1);
      t.assert(data.includes('test_key1'));
      t.assert(!data.includes('test_key2'));
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[matchPrefix] match max option', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('test_key1', 'test_value', resolve);
  });

  await new Promise((resolve) => {
    client.set('test_key2', 'test_value', resolve);
  });

  await new Promise((resolve) => {
    client.set('test_key3', 'test_value', resolve);
  });

  const options = {
    max: 2,
  };

  return new Promise((resolve) => {
    client.matchPrefix('test', options, (error, data) => {
      t.assert(data instanceof Array);
      t.is(data.length, 2);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[matchPrefix] no match', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('test_key1', 'test_value', resolve);
  });

  await new Promise((resolve) => {
    client.set('test_key2', 'test_value', resolve);
  });

  return new Promise((resolve) => {
    client.matchPrefix('foo', (error, data) => {
      t.assert(data instanceof Array);
      t.is(data.length, 0);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[matchPrefix] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.matchPrefix('test', (error, data) => {
      t.is(data, undefined);
      t.is(error, 'Connection error');
      resolve();
    });
  });
});

test.serial('[matchRegex] match', async (t) => {
  const client = new KyotoTocoon();

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

  return new Promise((resolve) => {
    client.matchRegex('^test_key[0-9]', (error, data) => {
      t.assert(data instanceof Array);
      t.is(data.length, 2);
      t.assert(data.includes('test_key1'));
      t.assert(data.includes('test_key2'));
      t.assert(!data.includes('foo'));
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[matchRegex] match DB option', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    const options = {
      db: 'blue',
    };
    client.set('test_key1', 'test_value', options, () => {
      resolve();
    });
  });

  await new Promise((resolve) => {
    const options = {
      db: 'red',
    };
    client.set('test_key2', 'test_value', options, () => {
      resolve();
    });
  });

  const options = {
    db: 'blue',
  };

  return new Promise((resolve) => {
    client.matchRegex('^test_key[0-9]', options, (error, data) => {
      t.assert(data instanceof Array);
      t.is(data.length, 1);
      t.assert(data.includes('test_key1'));
      t.assert(!data.includes('test_key2'));
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[matchRegex] match max option', async (t) => {
  const client = new KyotoTocoon();

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

  const options = {
    max: 2,
  };

  return new Promise((resolve) => {
    client.matchRegex('^test_key[0-9]', options, (error, data) => {
      t.assert(data instanceof Array);
      t.is(data.length, 2);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[matchRegex] no match', async (t) => {
  const client = new KyotoTocoon();

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

  return new Promise((resolve) => {
    client.matchRegex('foo', (error, data) => {
      t.assert(data instanceof Array);
      t.is(data.length, 0);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[matchRegex] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.matchRegex('test', (error, data) => {
      t.is(data, undefined);
      t.is(error, 'Connection error');
      resolve();
    });
  });
});

test.serial('[matchSimilar] match', async (t) => {
  const client = new KyotoTocoon();

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

  return new Promise((resolve) => {
    client.matchSimilar('test_key1', (error, data) => {
      t.assert(data instanceof Array);
      t.is(data.length, 2);
      t.assert(data.includes('test_key1'));
      t.assert(data.includes('test_key2'));
      t.assert(!data.includes('foo'));
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[matchSimilar] match DB option', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    const options = {
      db: 'blue',
    };
    client.set('test_key1', 'test_value', options, () => {
      resolve();
    });
  });

  await new Promise((resolve) => {
    const options = {
      db: 'red',
    };
    client.set('test_key2', 'test_value', options, () => {
      resolve();
    });
  });

  const options = {
    db: 'blue',
  };
  return new Promise((resolve) => {
    client.matchSimilar('test_key1', options, (error, data) => {
      t.assert(data instanceof Array);
      t.is(data.length, 1);
      t.assert(data.includes('test_key1'));
      t.assert(!data.includes('test_key2'));
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[matchSimilar] match range option', async (t) => {
  const client = new KyotoTocoon();

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

  const options = {
    range: 10,
  };

  return new Promise((resolve) => {
    client.matchSimilar('test_key1', options, (error, data) => {
      t.assert(data instanceof Array);
      t.is(data.length, 3);
      t.assert(data.includes('test_key1'));
      t.assert(data.includes('test_key2'));
      t.assert(data.includes('foo'));
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[matchSimilar] match utf option', async (t) => {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.set('京都', 'test_value', () => {
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.set('京芋', 'test_value', () => {
      resolve();
    });
  });

  await new Promise((resolve) => {
    client.set('foo', 'test_value', () => {
      resolve();
    });
  });

  const options = {
    utf: true,
  };

  return new Promise((resolve) => {
    client.matchSimilar('京都', options, (error, data) => {
      t.assert(data instanceof Array);
      t.is(data.length, 2);
      t.assert(data.includes('京都'));
      t.assert(data.includes('京芋'));
      t.assert(!data.includes('foo'));
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[matchSimilar] match max option', async (t) => {
  const client = new KyotoTocoon();

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

  const options = {
    max: 2,
  };

  return new Promise((resolve) => {
    client.matchSimilar('test_key1', options, (error, data) => {
      t.assert(data instanceof Array);
      t.is(data.length, 2);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[matchSimilar] no match', async (t) => {
  const client = new KyotoTocoon();

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

  return new Promise((resolve) => {
    client.matchSimilar('foo', (error, data) => {
      t.assert(data instanceof Array);
      t.is(data.length, 0);
      t.is(error, undefined);
      resolve();
    });
  });
});

test.serial('[matchSimilar] connection error', async (t) => {
  const client = new KyotoTocoon({
    host: 'localhost',
    port: 9999,
  });

  return new Promise((resolve) => {
    client.matchSimilar('test', (error, data) => {
      t.is(data, undefined);
      t.is(error, 'Connection error');
      resolve();
    });
  });
});
