'use strict';

const http = require('http');

function Rest(agent, options) {
  this.agent = agent;
  this.host = options.host;
  this.port = options.port;
}

Rest.prototype.get = function (key, options, callback) {
  let opt;
  let cb;

  if (typeof options === 'function') {
    opt = {};
    cb = options;
  } else {
    opt = options;
    cb = callback;
  }

  const requestOptions = {
    hostname: this.host,
    port: this.port,
    path: this._buildPath(key, opt.db),
    method: 'GET',
    agent: this.agent
  };

  http.request(requestOptions, function (res) {
    const bufs = [];
    let bufLength = 0;
    let str = '';

    res.on('data', function (chunk) {
      if (!Buffer.isBuffer(chunk)) {
        str += chunk;
      } else if (chunk.length) {
        bufs.push(chunk);
        bufLength += chunk.length;
      }
    });

    res.on('end', function () {
      let expire;
      let buf;
      let ret;

      if (res.statusCode === 200) {
        if (res.headers.hasOwnProperty('x-kt-xt')) {
          expire = new Date(res.headers['x-kt-xt']);
        }

        if (bufLength) {
          buf = Buffer.concat(bufs, bufLength);
          if (typeof opt.encoding === 'undefined' || opt.encoding === null) {
            ret = buf.toString();
          } else if (opt.encoding === 'binary') {
            ret = buf;
          } else {
            ret = buf.toString(opt.encoding);
          }
        } else {
          ret = str;
        }
        cb(undefined, ret, expire);
      } else if (res.statusCode === 404) {
        cb('No record was found');
      } else {
        cb('Connection error');
      }
    });
  }).on('error', function () {
    cb('Connection error');
  }).end();
};

Rest.prototype.set = function (key, value, options, callback) {
  this._put(key, value, 'set', options, callback);
};

Rest.prototype.add = function (key, value, options, callback) {
  this._put(key, value, 'add', options, callback);
};

Rest.prototype.replace = function (key, value, options, callback) {
  this._put(key, value, 'replace', options, callback);
};

Rest.prototype.remove = function (key, options, callback) {
  let opt;
  let cb;

  if (typeof options === 'function') {
    opt = {};
    cb = options;
  } else {
    opt = options;
    cb = callback;
  }

  const requestOptions = {
    hostname: this.host,
    port: this.port,
    path: this._buildPath(key, opt.db),
    method: 'DELETE',
    agent: this.agent
  };

  http.request(requestOptions, function (res) {
    res.on('data', function () {});

    res.on('end', function () {
      if (res.statusCode === 204) {
        cb();
      } else if (res.statusCode === 404) {
        cb('No record was found');
      } else {
        cb('Connection error');
      }
    });
  }).on('error', function () {
    cb('Connection error');
  }).end();
};

Rest.prototype._put = function (key, value, mode, options, callback) {
  let val;
  let opt;
  let cb;
  let date;
  const header = {};
  let encoding = 'utf8';

  if (typeof options === 'function') {
    opt = {};
    cb = options;
  } else {
    opt = options;
    cb = callback;
  }

  if (typeof value === 'string') {
    val = value;
    if (typeof opt.encoding !== 'undefined') {
      encoding = opt.encoding;
    }
    header['Content-Length'] = Buffer.byteLength(val, encoding);
  } else if (typeof value === 'number') {
    val = value.toString();
    header['Content-Length'] = Buffer.byteLength(val);
  } else if (Buffer.isBuffer(value)) {
    val = value;
    header['Content-Length'] = val.length;
  } else {
    val = JSON.stringify(value);
    header['Content-Length'] = Buffer.byteLength(val);
  }

  header['X-Kt-Mode'] = mode;

  if (opt.hasOwnProperty('expire')) {
    date = new Date();
    date.setSeconds(date.getSeconds() + opt.expire);
    header['X-Kt-Xt'] = date.toUTCString();
  }

  const requestOptions = {
    hostname: this.host,
    port: this.port,
    path: this._buildPath(key, opt.db),
    headers: header,
    method: 'PUT',
    agent: this.agent
  };

  http.request(requestOptions, function (res) {
    res.on('data', function () {});

    res.on('end', function () {
      if (res.statusCode === 201) {
        cb();
      } else {
        cb('Connection error');
      }
    });
  }).on('error', function () {
    cb('Connection error');
  }).end(val, encoding);
};

Rest.prototype._buildPath = function (key, db) {
  if (typeof db !== 'undefined' && db !== null) {
    return '/' + encodeURIComponent(db) + '/' + encodeURIComponent(key);
  }
  return '/' + encodeURIComponent(key);
};

module.exports = Rest;
