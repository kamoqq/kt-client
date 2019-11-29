# kt-client
[![NPM version](https://img.shields.io/npm/v/kt-client.svg)](https://www.npmjs.com/package/kt-client)
[![Build Status](https://github.com/kamoqq/node-kt-client/workflows/build/badge.svg)](https://github.com/kamoqq/node-kt-client/actions)
[![Coverage Status](https://coveralls.io/repos/kamoqq/node-kt-client/badge.svg?branch=master)](https://coveralls.io/r/kamoqq/node-kt-client?branch=master)
[![Dependency Status](https://david-dm.org/kamoqq/node-kt-client.svg)](https://david-dm.org/kamoqq/node-kt-client)
[![devDependency Status](https://david-dm.org/kamoqq/node-kt-client/dev-status.svg)](https://david-dm.org/kamoqq/node-kt-client#info=devDependencies)

KyotoTycoon client for Node.js

## Installation

```
npm install kt-client
```

## Setting up the client

```javascript
const KyotoTycoon = require('kt-client');
const kt = new KyotoTycoon(options);
```

### Options

* `host`: **String** KyotoTycoon server
* `port`: **Number** port number

## API

### kt.get(key, options, callback)

* `key`: **String** the name of the key
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.get('foo', (error, value) => {
  console.log(value);
});
```

### kt.set(key, value, options, callback)

* `key`: **String** the name of the key
* `value`: **Mixed** value
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.set('foo', 'bar', (error) => {
  console.log(error);
});
```

### kt.add(key, value, options, callback)

* `key`: **String** the name of the key
* `value`: **Mixed** value
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.add('foo', 'bar', (error) => {
  console.log(error);
});
```

### kt.replace(key, value, options, callback)

* `key`: **String** the name of the key
* `value`: **Mixed** value
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.replace('foo', 'bar', (error) => {
  console.log(error);
});
```

### kt.remove(key, callback)

* `key`: **String** the name of the key
* `callback`: **Function** the callback

```javascript
kt.remove('foo', (error) => {
  console.log(error);
});
```

### kt.void(callback)

* `callback`: **Function** the callback

```javascript
kt.void((error) => {
  console.log(error);
});
```

### kt.echo(callback)

* `params`: **Object** arbitrary records
* `callback`: **Function** the callback

```javascript
kt.echo({foo: 'bar'}, (error, data) => {
  console.log(data.foo);  // => bar
});
```

### kt.report(callback)

* `callback`: **Function** the callback

```javascript
kt.report((error, data) => {
  Object.keys(data).forEach((key) => {
    console.log(`key: ${key}, value: ${data[key]}`);
  });
});
```

### kt.status(options, callback)

* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.status((error, data) => {
  Object.keys(data).forEach((key) => {
    console.log(`key: ${key}, value: ${data[key]}`);
  });
});
```

### kt.clear(options, callback)

* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.clear((error) => {
  console.log(error);
});
```

### kt.append(key, value, options, callback)

* `key`: **String** the name of the key
* `value`: **Mixed** value
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.append(key, value, (error) => {
  console.log(error);
});
```

### kt.increment(key, num, options, callback)

* `key`: **String** the name of the key
* `num`: **Number** the additional number
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.increment(key, num, (error, num) => {
  console.log(num);
});
```

### kt.incrementDouble(key, num, options, callback)

* `key`: **String** the name of the key
* `num`: **Number** the additional number
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.incrementDouble(key, num, (error, num) => {
  console.log(num);
});
```

### kt.cas(key, oldValue, newValue, options, callback)

* `key`: **String** the name of the key
* `oldValue`: **Mixed** the old value
* `newValue`: **Mixed** the new value
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.cas(key, oldValue, newValue, (error) => {
  console.log(err);
});
```

### kt.check(key, options, callback)

* `key`: **String** the name of the key
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.check(key, (error, size, expire) => {
  console.log(size);
  console.log(expire);
});
```

### kt.seize(key, options, callback)

* `key`: **String** the name of the key
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.seize(key, (error, value, expire) => {
  console.log(value);
  console.log(expire);
});
```

### kt.setBulk(records, options, callback)

* `records`: **Object** the records
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.setBulk(records, (error) => {
  console.log(error);
});
```

### kt.removeBulk(records, options, callback)

* `keys`: **Array** the key of the record
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.removeBulk(keys, (error) => {
  console.log(error);
});
```

### kt.getBulk(records, options, callback)

* `keys`: **Array** the key of the record
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.getBulk(keys, (error, ret) => {
  console.log(ret.key);
});
```

## kt.vacuum(options, callback)

* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.vacuum((error) => {
  console.log(error);
});
```

### kt.matchPrefix(prefix, options, callback)

* `prefix`: **String** the prefix string
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.matchPrefix('foo', (error, data) => {
  data.forEach((v) => {
    console.log(v);
  });
});
```

### kt.matchRegex(regex, options, callback)

* `regex`: **String** the regular expression string
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.matchRegex('foo.*', (error, data) => {
  data.forEach((v) => {
    console.log(v);
  });
});
```

### kt.matchSimilar(origin, options, callback)

* `origin`: **String** the origin string
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.matchSimilar('foo', (error, data) => {
  data.forEach((v) => {
    console.log(v);
  });
});
```

## License
[MIT](https://github.com/kamoqq/kt-client/blob/master/LICENSE)
