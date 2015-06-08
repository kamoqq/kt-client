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
var KyotoTocoon = require('kt-client');
var kt = new KyotoTocoon(options);
```

### Options

* `host`: **String** KyotoTocoon server
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
kt.get('foo', function(error) {
  console.log(value);
});
```

### kt.add(key, value, options, callback)

* `key`: **String** the name of the key
* `value`: **Mixed** value
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.get('foo', function(error) {
  console.log(value);
});
```

### kt.replace(key, value, options, callback)

* `key`: **String** the name of the key
* `value`: **Mixed** value
* `options`: **Object** options
* `callback`: **Function** the callback

```javascript
kt.get('foo', function(error) {
  console.log(value);
});
```

### kt.remove(key, callback)

* `key`: **String** the name of the key
* `callback`: **Function** the callback

```javascript
kt.get('foo', function(error) {
  console.log(value);
});
```

## License
[MIT](https://github.com/kamoqq/kt-client/blob/master/LICENSE)
