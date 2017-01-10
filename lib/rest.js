'use strict';

const http = require('http');

class Rest {
  constructor(agent, options) {
    this.agent = agent;
    this.host = options.host;
    this.port = options.port;
  }

  get(key, options, callback) {
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
      agent: this.agent,
    };

    http.request(requestOptions, (res) => {
      const bufs = [];
      let bufLength = 0;
      let str = '';

      res.on('data', (chunk) => {
        if (!Buffer.isBuffer(chunk)) {
          str += chunk;
        } else if (chunk.length) {
          bufs.push(chunk);
          bufLength += chunk.length;
        }
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          let expire;
          let ret;

          if (res.headers.hasOwnProperty('x-kt-xt')) {
            expire = new Date(res.headers['x-kt-xt']);
          }

          if (bufLength) {
            const buf = Buffer.concat(bufs, bufLength);
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
    }).on('error', () => {
      cb('Connection error');
    }).end();
  }

  set(key, value, options, callback) {
    this._put(key, value, 'set', options, callback);
  }

  add(key, value, options, callback) {
    this._put(key, value, 'add', options, callback);
  }

  replace(key, value, options, callback) {
    this._put(key, value, 'replace', options, callback);
  }

  remove(key, options, callback) {
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
      agent: this.agent,
    };

    http.request(requestOptions, (res) => {
      res.on('data', () => {});

      res.on('end', () => {
        if (res.statusCode === 204) {
          cb();
        } else if (res.statusCode === 404) {
          cb('No record was found');
        } else {
          cb('Connection error');
        }
      });
    }).on('error', () => {
      cb('Connection error');
    }).end();
  }

  _put(key, value, mode, options, callback) {
    let val;
    let opt;
    let cb;
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
      const date = new Date();
      date.setSeconds(date.getSeconds() + opt.expire);
      header['X-Kt-Xt'] = date.toUTCString();
    }

    const requestOptions = {
      hostname: this.host,
      port: this.port,
      path: this._buildPath(key, opt.db),
      headers: header,
      method: 'PUT',
      agent: this.agent,
    };

    http.request(requestOptions, (res) => {
      res.on('data', () => {});

      res.on('end', () => {
        if (res.statusCode === 201) {
          cb();
        } else {
          cb('Connection error');
        }
      });
    }).on('error', () => {
      cb('Connection error');
    }).end(val, encoding);
  }

  _buildPath(key, db) {
    if (typeof db !== 'undefined' && db !== null) {
      return `/${encodeURIComponent(db)}/${encodeURIComponent(key)}`;
    }
    return `/${encodeURIComponent(key)}`;
  }
}

module.exports = Rest;
