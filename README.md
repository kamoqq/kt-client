# kt-client
[![Build Status](https://travis-ci.org/kamoqq/node-kt-client.svg?branch=master)](https://travis-ci.org/kamoqq/node-kt-client)
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
var KyotoTycoon = require('kt-client');
var kt = new KyotoTycoon(options);
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
kt.get('foo', function (error, value) {
  console.log(value);
});
```

### kt.set(key, value, options, callback)

* `key`: **String** the name of the key
* `value`: **Mixed** value
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.set('foo', 'bar', function (error) {
  console.log(error);
});
```

### kt.add(key, value, options, callback)

* `key`: **String** the name of the key
* `value`: **Mixed** value
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.add('foo', 'bar', function (error) {
  console.log(error);
});
```

### kt.replace(key, value, options, callback)

* `key`: **String** the name of the key
* `value`: **Mixed** value
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.replace('foo', 'bar', function (error) {
  console.log(error);
});
```

### kt.remove(key, callback)

* `key`: **String** the name of the key
* `callback`: **Function** the callback

```javascript
kt.remove('foo', function (error) {
  console.log(error);
});
```

### kt.void(callback)

* `callback`: **Function** the callback

```javascript
kt.void(function (error) {
  console.log(error);
});
```

### kt.echo(callback)

* `params`: **Object** arbitrary records
* `callback`: **Function** the callback

```javascript
kt.echo({foo: 'bar'}, function (error, data) {
  console.log(data.foo);  // => bar
});
```

### kt.report(callback)

* `callback`: **Function** the callback

```javascript
kt.report(function (error, data) {
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      console.log('key: ' + key + ', value: ' data[key]);      
    }
  }
});
```

### kt.status(options, callback)

* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.status(function (error, data) {
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      console.log('key: ' + key + ', value: ' data[key]);      
    }
  }
});
```

### kt.clear(options, callback)

* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.clear(function (error) {
  console.log(error);
});
```

### kt.append(key, value, options, callback)

* `key`: **String** the name of the key
* `value`: **Mixed** value
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.append(key, value, function (error) {
  console.log(error);
});
```

### kt.increment(key, value, options, callback)

* `key`: **String** the name of the key
* `num`: **Number** the additional number
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.increment(key, num, function (error, num) {
  console.log(num);
});
```

### kt.incrementDouble(key, value, options, callback)

* `key`: **String** the name of the key
* `num`: **Number** the additional number
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.incrementDouble(key, num, function (error, num) {
  console.log(num);
});
```

### kt.check(key, options, callback)

* `key`: **String** the name of the key
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.check(key, function (error, size, expire) {
  console.log(size);
  console.log(expire);
});
```

### kt.matchPrefix(prefix, options, callback)

* `prefix`: **String** the prefix string
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.matchPrefix('foo', function (error, data) {
  for (var i = 0; i < data.length; ++i) {
    console.log(data[i]);
  }
});
```

### kt.matchRegex(regex, options, callback)

* `regex`: **String** the regular expression string
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.matchRegex('foo.*', function (error, data) {
  for (var i = 0; i < data.length; ++i) {
    console.log(data[i]);
  }
});
```

## License
[MIT](https://github.com/kamoqq/kt-client/blob/master/LICENSE)
