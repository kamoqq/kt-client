# kt-client
[![Build Status](https://travis-ci.org/kamoqq/kt-client.svg?branch=master)](https://travis-ci.org/kamoqq/kt-client)
[![Coverage Status](https://coveralls.io/repos/kamoqq/kt-client/badge.svg?branch=master)](https://coveralls.io/r/kamoqq/kt-client?branch=master)

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
kt.get('foo', function(error, value) {
  console.log(value);
});
```

### kt.set(key, value, options, callback)

* `key`: **String** the name of the key
* `value`: **Mixed** value
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.set('foo', 'bar', function(error) {
  console.log(error);
});
```

### kt.add(key, value, options, callback)

* `key`: **String** the name of the key
* `value`: **Mixed** value
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.add('foo', 'bar', function(error) {
  console.log(error);
});
```

### kt.replace(key, value, options, callback)

* `key`: **String** the name of the key
* `value`: **Mixed** value
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.replace('foo', 'bar', function(error) {
  console.log(error);
});
```

### kt.remove(key, callback)

* `key`: **String** the name of the key
* `callback`: **Function** the callback

```javascript
kt.remove('foo', function(error) {
  console.log(error);
});
```

### kt.void(callback)

* `callback`: **Function** the callback

```javascript
kt.void(function(error) {
  console.log(error);
});
```

### kt.echo(callback)

* `params`: **Object** arbitrary records
* `callback`: **Function** the callback

```javascript
kt.echo({foo: 'bar'}, function(error, data) {
  console.log(data.foo);  // => bar
});
```

### kt.report(callback)

* `callback`: **Function** the callback

```javascript
kt.report(function(error, data) {
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      console.log('key: ' + key + ', value: ' data[key]);      
    }
  }
});
```

### kt.matchPrefix(key, callback)

* `prefix`: **String** the prefix string
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.matchPrefix('foo', function(error, data) {
  for (var i = 0; i < data.length; ++i) {
    console.log(data[i]);
  }
});
```

### kt.matchRegex(key, callback)

* `regex`: **String** the regular expression string
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.matchRegex('foo.*', function(error, data) {
  for (var i = 0; i < data.length; ++i) {
    console.log(data[i]);
  }
});
```

## License
[MIT](https://github.com/kamoqq/kt-client/blob/master/LICENSE)
