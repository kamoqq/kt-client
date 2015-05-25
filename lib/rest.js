'use strict';

var BufferList = require('bl');

function Rest(agent, options) {
  this.agent = agent;
  this.host = options.host;
  this.port = options.port;
}

Rest.prototype.get = function(key, options, callback) {
  var opt, cb;
  var requestOptions = {
    hostname: this.host,
    port: this.port,
    path: '/' + encodeURIComponent(key),
    method: 'GET'
  };

  if (typeof options === 'function') {
    opt = {};
    cb  = options;
  } else {
    opt = options;
    cb  = callback;
  }

  this.agent.request(requestOptions, function(res) {
    var buf = new BufferList(),
        str = '';

    res.on('data', function (chunk) {
      if (Buffer.isBuffer(chunk)) {
        buf.append(chunk);
      } else {
        str += chunk;
      }
    });

    res.on('end', function () {
      var expire, ret;

      if (res.statusCode === 200) {
        if (res.headers.hasOwnProperty('x-kt-xt')) {
          expire = new Date(res.headers['x-kt-xt']);
        } else {
          expire = null;
        }

        if (buf.length) {
          if (typeof opt.encoding !== 'undefined' || opt.encoding === null) {
            ret = buf.slice();
          } else {
            ret = buf.toString(opt.encoding);
          }
        } else {
          ret = str;
        }
        cb(undefined, ret, expire);
      } else if (res.statusCode === 404) {
        cb('No record was found', null, null);
      } else {
        cb('Connection error', null, null);
      }
    });
  }).on('error', function() {
    cb('Connection error', null);
  }).end();
};

Rest.prototype.set = function(key, value, options, callback) {
  this._put(key, value, 'set', options, callback);
};

Rest.prototype.add = function(key, value, options, callback) {
  this._put(key, value, 'add', options, callback);
};

Rest.prototype.replace = function(key, value, options, callback) {
  this._put(key, value, 'replace', options, callback);
};

Rest.prototype.remove = function(key, options, callback) {
  if (typeof options === 'function') {
    callback = options;
  }

  var requestOptions = {
    hostname: this.host,
    port: this.port,
    path: '/' + encodeURIComponent(key),
    method: 'DELETE'
  };

  this.agent.request(requestOptions, function(res) {
    res.on('end', function () {
      if (res.statusCode === 204) {
        callback();
      } else if (res.statusCode === 404) {
        callback('No record was found');
      } else {
        callback('Connection error');
      }
    });
  }).on('error', function() {
    callback('Connection error');
  }).end();
};

Rest.prototype._put = function(key, value, mode, options, callback) {
  var val, opt, cb, header = {}, encoding = 'utf8';

  if (typeof options === 'function') {
    opt = {};
    cb  = options;
  } else {
    opt = options;
    cb  = callback;
  }

  if (typeof value === 'string') {
    val = value;
    if (typeof opt.encoding !== 'undefined') {
      encoding = opt.encoding;
    }
    header['Content-Length'] = Buffer.byteLength(val, encoding);
  } else if (Buffer.isBuffer(value)) {
    val = value;
    header['Content-Length'] = Buffer.byteLength(val);
  } else {
    val = value.toString();
    header['Content-Length'] = Buffer.byteLength(val);
  }

  header['X-Kt-Mode'] = mode;

  if (opt.hasOwnProperty('expire')) {
    header['X-Kt-Xt'] = opt.expire;
  }

  var requestOptions = {
    hostname: this.host,
    port: this.port,
    path: '/' + encodeURIComponent(key),
    headers: header,
    method: 'PUT'
  };

  this.agent.request(requestOptions, function(res) {
    res.on('end', function () {
      if (res.statusCode === 201) {
        cb();
      } else {
        cb('Connection error');
      }
    });
  }).on('error', function() {
    cb('Connection error');
  }).end(value);
};
