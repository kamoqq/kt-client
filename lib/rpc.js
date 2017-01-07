'use strict';

const http = require('http');
const querystring = require('querystring');

function Rpc(agent, options) {
  this.agent = agent;
  this.host = options.host;
  this.port = options.port;
}

Rpc.prototype.void = (callback) => {
  this._call('void', undefined, {}, callback);
};

Rpc.prototype.echo = (params, callback) => {
  this._call('echo', params, {}, callback);
};

Rpc.prototype.report = (callback) => {
  this._call('report', undefined, {}, callback);
};

// Rpc.prototype.playScript = function (options, callback) {};
// Rpc.prototype.tuneReplication = function (options, callback) {};

Rpc.prototype.status = (options, callback) => {
  let cb;
  let opt = {};
  const params = {};

  if (typeof options === 'function') {
    opt = {};
    cb = options;
  } else {
    opt = options;
    cb = callback;
  }

  if (typeof opt.db !== 'undefined') {
    params.DB = opt.db;
  }

  this._call('status', params, {}, cb);
};

Rpc.prototype.clear = (options, callback) => {
  let cb;
  let opt = {};
  const params = {};

  if (typeof options === 'function') {
    opt = {};
    cb = options;
  } else {
    opt = options;
    cb = callback;
  }

  if (typeof opt.db !== 'undefined') {
    params.DB = opt.db;
  }

  this._call('clear', params, {}, cb);
};

// Rpc.prototype.synchronize = function (options, callback) {};

Rpc.prototype.append = (key, value, options, callback) => {
  let cb;
  let opt = {};
  const params = {};

  if (typeof options === 'function') {
    opt = {};
    cb = options;
  } else {
    opt = options;
    cb = callback;
  }

  params.key = key;
  params.value = value;

  if (typeof opt.db !== 'undefined') {
    params.DB = opt.db;
  }

  if (typeof opt.expire !== 'undefined') {
    params.xt = opt.expire;
  }

  this._call('append', params, {}, cb);
};

Rpc.prototype.increment = (key, num, options, callback) => {
  let cb;
  let opt = {};
  const params = {};

  if (typeof options === 'function') {
    opt = {};
    cb = options;
  } else {
    opt = options;
    cb = callback;
  }

  params.key = key;
  params.num = num;

  if (typeof opt.db !== 'undefined') {
    params.DB = opt.db;
  }

  if (typeof opt.expire !== 'undefined') {
    params.xt = opt.expire;
  }

  if (typeof opt.orig !== 'undefined') {
    params.orig = opt.orig;
  }

  this._call('increment', params, {}, (error, ret) => {
    let number;

    if (typeof error === 'undefined' && typeof ret.num !== 'undefined') {
      number = Number(ret.num);
    }

    cb(error, number);
  });
};

Rpc.prototype.incrementDouble = (key, num, options, callback) => {
  let cb;
  let opt = {};
  const params = {};

  if (typeof options === 'function') {
    opt = {};
    cb = options;
  } else {
    opt = options;
    cb = callback;
  }

  params.key = key;
  params.num = num;

  if (typeof opt.db !== 'undefined') {
    params.DB = opt.db;
  }

  if (typeof opt.expire !== 'undefined') {
    params.xt = opt.expire;
  }

  if (typeof opt.orig !== 'undefined') {
    params.orig = opt.orig;
  }

  this._call('increment_double', params, {}, (error, ret) => {
    let number;

    if (typeof error === 'undefined' && typeof ret.num !== 'undefined') {
      number = Number(ret.num);
    }

    cb(error, number);
  });
};

Rpc.prototype.cas = (key, oldValue, newValue, options, callback) => {
  let cb;
  let opt = {};
  const params = {};

  if (typeof options === 'function') {
    opt = {};
    cb = options;
  } else {
    opt = options;
    cb = callback;
  }

  params.key = key;

  if (typeof oldValue !== 'undefined') {
    params.oval = oldValue;
  }

  if (typeof newValue !== 'undefined') {
    params.nval = newValue;
  }

  if (typeof opt.db !== 'undefined') {
    params.DB = opt.db;
  }

  if (typeof opt.expire !== 'undefined') {
    params.xt = opt.expire;
  }

  this._call('cas', params, {}, (error, ret) => {
    let errMsg = error;

    if (errMsg === 'Invalid operation') {
      errMsg = 'The old value assumption was failed';
    }

    cb(errMsg, ret);
  });
};

Rpc.prototype.check = (key, options, callback) => {
  let cb;
  let opt = {};
  const params = {};

  if (typeof options === 'function') {
    opt = {};
    cb = options;
  } else {
    opt = options;
    cb = callback;
  }

  params.key = key;

  if (typeof opt.db !== 'undefined') {
    params.DB = opt.db;
  }

  this._call('check', params, {}, (error, ret) => {
    let size;
    let expire;

    if (typeof error === 'undefined') {
      if (typeof ret.vsiz !== 'undefined') {
        size = Number(ret.vsiz);
      }

      if (typeof ret.xt !== 'undefined') {
        expire = new Date(ret.xt);
      }
    }

    cb(error, size, expire);
  });
};

Rpc.prototype.seize = (key, options, callback) => {
  let cb;
  let opt = {};
  const params = {};

  if (typeof options === 'function') {
    opt = {};
    cb = options;
  } else {
    opt = options;
    cb = callback;
  }

  params.key = key;

  if (typeof opt.db !== 'undefined') {
    params.DB = opt.db;
  }

  this._call('seize', params, {}, (error, ret) => {
    let value;
    let expire;

    if (typeof error === 'undefined') {
      if (typeof ret.value !== 'undefined') {
        value = ret.value;
      }

      if (typeof ret.xt !== 'undefined') {
        expire = new Date(ret.xt);
      }
    }

    cb(error, value, expire);
  });
};

Rpc.prototype.setBulk = (records, options, callback) => {
  let cb;
  let opt = {};
  const params = {};

  if (typeof options === 'function') {
    opt = {};
    cb = options;
  } else {
    opt = options;
    cb = callback;
  }

  Object.keys(records).forEach((key) => {
    if (typeof records[key] === 'string' || typeof records[key] === 'number') {
      params[`_${key}`] = records[key];
    } else if (Buffer.isBuffer(records[key])) {
      params[`_${key}`] = records[key].toString();
    } else {
      params[`_${key}`] = JSON.stringify(records[key]);
    }
  });

  if (typeof opt.db !== 'undefined') {
    params.DB = opt.db;
  }

  if (typeof opt.atomic !== 'undefined') {
    params.atomic = '';
  }

  this._call('set_bulk', params, {}, cb);
};

Rpc.prototype.removeBulk = (keys, options, callback) => {
  let cb;
  let opt = {};
  const params = {};

  if (typeof options === 'function') {
    opt = {};
    cb = options;
  } else {
    opt = options;
    cb = callback;
  }

  for (let i = 0; i < keys.length; ++i) {
    params[`_${keys[i]}`] = '';
  }

  if (typeof opt.db !== 'undefined') {
    params.DB = opt.db;
  }

  if (typeof opt.atomic !== 'undefined') {
    params.atomic = '';
  }

  this._call('remove_bulk', params, {}, cb);
};

Rpc.prototype.getBulk = (keys, options, callback) => {
  let cb;
  let opt = {};
  const params = {};

  if (typeof options === 'function') {
    opt = {};
    cb = options;
  } else {
    opt = options;
    cb = callback;
  }

  for (let i = 0; i < keys.length; ++i) {
    params[`_${keys[i]}`] = '';
  }

  if (typeof opt.db !== 'undefined') {
    params.DB = opt.db;
  }

  if (typeof opt.atomic !== 'undefined') {
    params.atomic = '';
  }

  this._call('get_bulk', params, opt, (error, ret) => {
    let data;

    if (typeof error === 'undefined') {
      data = {};
      for (let i = 0; i < keys.length; ++i) {
        data[keys[i]] = ret[`_${keys[i]}`];
      }
    }

    cb(error, data);
  });
};

Rpc.prototype.vacuum = (options, callback) => {
  let cb;
  let opt = {};
  const params = {};

  if (typeof options === 'function') {
    opt = {};
    cb = options;
  } else {
    opt = options;
    cb = callback;
  }

  if (typeof opt.step !== 'undefined') {
    params.step = opt.step;
  }

  if (typeof opt.db !== 'undefined') {
    params.DB = opt.db;
  }

  this._call('vacuum', params, {}, cb);
};

Rpc.prototype.matchPrefix = (prefix, options, callback) => {
  let cb;
  let opt = {};
  const params = {};

  if (typeof options === 'function') {
    opt = {};
    cb = options;
  } else {
    opt = options;
    cb = callback;
  }

  params.prefix = prefix;

  if (typeof opt.db !== 'undefined') {
    params.DB = opt.db;
  }

  if (typeof opt.max !== 'undefined') {
    params.max = opt.max;
  }

  this._call('match_prefix', params, {}, (error, ret) => {
    let data;

    if (typeof error === 'undefined') {
      data = [];
      Object.keys(ret).forEach((key) => {
        if (key[0] === '_') {
          data.push(key.substr(1));
        }
      });
    }

    cb(error, data);
  });
};

Rpc.prototype.matchRegex = (regex, options, callback) => {
  let cb;
  let opt = {};
  const params = {};

  if (typeof options === 'function') {
    opt = {};
    cb = options;
  } else {
    opt = options;
    cb = callback;
  }

  params.regex = regex;

  if (typeof opt.db !== 'undefined') {
    params.DB = opt.db;
  }

  if (typeof opt.max !== 'undefined') {
    params.max = opt.max;
  }

  this._call('match_regex', params, {}, (error, ret) => {
    let data;

    if (typeof error === 'undefined') {
      data = [];
      Object.keys(ret).forEach((key) => {
        if (key[0] === '_') {
          data.push(key.substr(1));
        }
      });
    }

    cb(error, data);
  });
};

Rpc.prototype.matchSimilar = (origin, options, callback) => {
  let cb;
  let opt = {};
  const params = {};

  if (typeof options === 'function') {
    opt = {};
    cb = options;
  } else {
    opt = options;
    cb = callback;
  }

  params.origin = origin;

  if (typeof opt.db !== 'undefined') {
    params.DB = opt.db;
  }

  if (typeof opt.range !== 'undefined') {
    params.range = opt.range;
  }

  if (typeof opt.utf !== 'undefined') {
    params.utf = '';
  }

  if (typeof opt.max !== 'undefined') {
    params.max = opt.max;
  }

  this._call('match_similar', params, {}, (error, ret) => {
    let data;

    if (typeof error === 'undefined') {
      data = [];
      Object.keys(ret).forEach((key) => {
        if (key[0] === '_') {
          data.push(key.substr(1));
        }
      });
    }

    cb(error, data);
  });
};

// Rpc.prototype.curJump = function (options, callback) {};
// Rpc.prototype.curJumpBack = function (options, callback) {};
// Rpc.prototype.curStep = function (options, callback) {};
// Rpc.prototype.curStepBack = function (options, callback) {};
// Rpc.prototype.curSetValue = function (options, callback) {};
// Rpc.prototype.curRemove = function (options, callback) {};
// Rpc.prototype.curGetGey = function (options, callback) {};
// Rpc.prototype.curGetValue = function (options, callback) {};
// Rpc.prototype.curGet = function (options, callback) {};
// Rpc.prototype.curSeize = function (options, callback) {};
// Rpc.prototype.curDelete = function (options, callback) {};

Rpc.prototype._call = (method, params, options, callback) => {
  let paramStr = '';

  if (typeof params !== 'undefined') {
    paramStr = `?${querystring.stringify(params)}`;
  }

  const requestOptions = {
    hostname: this.host,
    port: this.port,
    path: `/rpc/${method}${paramStr}`,
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
      let ret;

      if (res.statusCode === 200) {
        if (bufLength) {
          // TSV-RPC response is string only
          ret = Buffer.concat(bufs, bufLength).toString();
        } else {
          ret = str;
        }

        if (typeof res.headers['content-type'] !== 'string') {
          callback(undefined, this._parse(ret, options.encoding));
        } else if (res.headers['content-type'].indexOf('colenc=B') !== -1) {
          callback(undefined, this._parseBase64Encode(ret, options.encoding));
        } else if (res.headers['content-type'].indexOf('colenc=U') !== -1) {
          callback(undefined, this._parseURLEncode(ret, options.encoding));
        } else {
          callback(undefined, this._parse(ret, options.encoding));
        }
      } else if (res.statusCode === 404) {
        callback('No record was found');
      } else if (res.statusCode === 400) {
        callback('Bad request');
      } else if (res.statusCode === 450) {
        callback('Invalid operation');
      } else {
        callback('Connection error');
      }
    });
  }).on('error', () => {
    callback('Connection error');
  }).end();
};

Rpc.prototype._parse = (tsv, encoding) => {
  let lines = [];
  let kv = [];
  const ret = {};
  let i = 0;

  if (typeof tsv === 'string' && tsv.length > 0) {
    lines = tsv.replace(/\n$/, '').split('\n');

    if (typeof encoding === 'undefined' || encoding === null) {
      for (; i < lines.length; ++i) {
        kv = lines[i].split('\t');
        ret[kv[0]] = kv[1];
      }
    } else if (encoding === 'binary') {
      for (; i < lines.length; ++i) {
        kv = lines[i].split('\t');
        ret[kv[0]] = new Buffer(kv[1]);
      }
    } else {
      for (; i < lines.length; ++i) {
        kv = lines[i].split('\t');
        ret[kv[0]] = new Buffer(kv[1]).toString(encoding);
      }
    }
  }

  return ret;
};

Rpc.prototype._parseBase64Encode = (tsv, encoding) => {
  let lines = [];
  let kv = [];
  const ret = {};
  let i = 0;

  if (typeof tsv === 'string' && tsv.length > 0) {
    lines = tsv.replace(/\n$/, '').split('\n');

    if (typeof encoding === 'undefined' || encoding === null) {
      for (; i < lines.length; ++i) {
        kv = lines[i].split('\t');
        ret[new Buffer(kv[0], 'base64').toString()] =
        new Buffer(kv[1], 'base64').toString();
      }
    } else if (encoding === 'binary') {
      for (; i < lines.length; ++i) {
        kv = lines[i].split('\t');
        ret[new Buffer(kv[0], 'base64').toString()] = new Buffer(kv[1], 'base64');
      }
    } else {
      for (; i < lines.length; ++i) {
        kv = lines[i].split('\t');
        ret[new Buffer(kv[0], 'base64').toString(encoding)] =
        new Buffer(kv[1], 'base64').toString(encoding);
      }
    }
  }

  return ret;
};

Rpc.prototype._parseURLEncode = (tsv, encoding) => {
  let lines = [];
  let kv = [];
  const ret = {};
  let i = 0;

  if (typeof tsv === 'string' && tsv.length > 0) {
    lines = tsv.replace(/\n$/, '').split('\n');
    if (typeof encoding === 'undefined' || encoding === null) {
      for (; i < lines.length; ++i) {
        kv = lines[i].split('\t');
        ret[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
      }
    } else if (encoding === 'binary') {
      for (; i < lines.length; ++i) {
        kv = lines[i].split('\t');
        ret[decodeURIComponent(kv[0])] = new Buffer(decodeURIComponent(kv[1]));
      }
    } else {
      for (; i < lines.length; ++i) {
        kv = lines[i].split('\t');
        ret[decodeURIComponent(kv[0])] = new Buffer(decodeURIComponent(kv[1])).toString(encoding);
      }
    }
  }

  return ret;
};

module.exports = Rpc;
