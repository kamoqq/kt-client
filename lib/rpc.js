'use strict';

var http = require('http');
var querystring = require('querystring');
var BufferList = require('bl');

function Rpc(agent, options) {
  this.agent = agent;
  this.host = options.host;
  this.port = options.port;
}

Rpc.prototype.void = function (callback) {
  this._call('void', undefined, {}, callback);
};

Rpc.prototype.echo = function (params, callback) {
  this._call('echo', params, {}, callback);
};

Rpc.prototype.report = function (callback) {
  this._call('report', undefined, {}, callback);
};

// Rpc.prototype.playScript = function (options, callback) {};
// Rpc.prototype.tuneReplication = function (options, callback) {};

Rpc.prototype.status = function (options, callback) {
  var cb, opt = {}, params = {};

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

Rpc.prototype.clear = function (options, callback) {
  var cb, opt = {}, params = {};

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

Rpc.prototype.append = function (key, value, options, callback) {
  var cb, opt = {}, params = {};

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

Rpc.prototype.increment = function (key, num, options, callback) {
  var cb, opt = {}, params = {};

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

  this._call('increment', params, {}, function (error, ret) {
    var number;

    if (typeof error !== 'undefined') {
      return cb(error);
    }

    if (typeof ret.num !== 'undefined') {
      number = Number(ret.num);
    }

    cb(error, number);
  });
};

Rpc.prototype.incrementDouble = function (key, num, options, callback) {
  var cb, opt = {}, params = {};

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

  this._call('increment_double', params, {}, function (error, ret) {
    var number;

    if (typeof error !== 'undefined') {
      return cb(error);
    }

    if (typeof ret.num !== 'undefined') {
      number = Number(ret.num);
    }

    cb(error, number);
  });
};

// Rpc.prototype.cas = function (options, callback) {};

Rpc.prototype.check = function (key, options, callback) {
  var cb, opt = {}, params = {};

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

  this._call('check', params, {}, function (error, ret) {
    var size, expire;

    if (typeof error !== 'undefined') {
      cb(error);
      return;
    }

    if (typeof ret.vsiz !== 'undefined') {
      size = Number(ret.vsiz);
    }

    if (typeof ret.xt !== 'undefined') {
      expire = new Date(ret.xt);
    }

    cb(error, size, expire);
  });
};

Rpc.prototype.seize = function (key, options, callback) {
  var cb, opt = {}, params = {};

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

  this._call('seize', params, {}, function (error, ret) {
    var value, expire;

    if (typeof error !== 'undefined') {
      cb(error);
      return;
    }

    if (typeof ret.value !== 'undefined') {
      value = ret.value;
    }

    if (typeof ret.xt !== 'undefined') {
      expire = new Date(ret.xt);
    }

    cb(error, value, expire);
  });
};

// Rpc.prototype.setBulk = function (options, callback) {};
// Rpc.prototype.removeBulk = function (options, callback) {};

Rpc.prototype.getBulk = function (keys, options, callback) {
  var cb, opt = {}, params = {};

  if (typeof options === 'function') {
    opt = {};
    cb = options;
  } else {
    opt = options;
    cb = callback;
  }

  for (var i = 0; i < keys.length; ++i) {
    params['_' + keys[i]] = '';
  }

  if (typeof opt.db !== 'undefined') {
    params.DB = opt.db;
  }

  if (typeof opt.atomic !== 'undefined') {
    params.atomic = '';
  }

  this._call('get_bulk', params, opt, function (error, ret) {
    var data = {};

    if (typeof error !== 'undefined') {
      cb(error);
      return;
    }

    for (var j = 0; j < keys.length; ++j) {
      data[keys[j]] = ret['_' + keys[j]];
    }

    cb(undefined, data);
  });
};

Rpc.prototype.vacuum = function (options, callback) {
  var cb, opt = {}, params = {};

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

Rpc.prototype.matchPrefix = function (prefix, options, callback) {
  var cb, opt = {}, params = {};

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

  this._call('match_prefix', params, {}, function (error, ret) {
    var data = [];

    if (typeof error !== 'undefined') {
      cb(error);
      return;
    }

    for (var key in ret) {
      if (ret.hasOwnProperty(key) && key[0] === '_') {
        data.push(key.substr(1));
      }
    }
    cb(undefined, data);
  });
};

Rpc.prototype.matchRegex = function (regex, options, callback) {
  var cb, opt = {}, params = {};

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

  this._call('match_regex', params, {}, function (error, ret) {
    var data = [];

    if (typeof error !== 'undefined') {
      cb(error);
      return;
    }

    for (var key in ret) {
      if (ret.hasOwnProperty(key) && key[0] === '_') {
        data.push(key.substr(1));
      }
    }
    cb(undefined, data);
  });
};

// Rpc.prototype.matchSimilar = function (options, callback) {};
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

Rpc.prototype._call = function (method, params, options, callback) {
  var _this = this, paramStr = '';
  if (typeof params !== 'undefined') {
    paramStr = '?' + querystring.stringify(params);
  }
  var requestOptions = {
    hostname: this.host,
    port: this.port,
    path: '/rpc/' + method + paramStr,
    method: 'GET',
    agent: this.agent
  };

  http.request(requestOptions, function (res) {
    var buf = new BufferList(), str = '';

    res.on('data', function (chunk) {
      if (Buffer.isBuffer(chunk)) {
        buf.append(chunk);
      } else {
        str += chunk;
      }
    });

    res.on('end', function () {
      var ret;

      if (res.statusCode === 200) {
        if (buf.length) {
          // TSV-RPC response is string only
          ret = buf.toString();
        } else {
          ret = str;
        }

        if (typeof res.headers['content-type'] !== 'string') {
          callback(undefined, _this._parse(ret));
        } else if (res.headers['content-type'].indexOf('colenc=B') !== -1) {
          callback(undefined, _this._parseBase64Encode(ret, options.encoding));
        } else if (res.headers['content-type'].indexOf('colenc=U') !== -1) {
          callback(undefined, _this._parseURLEncode(ret));
        } else {
          callback(undefined, _this._parse(ret));
        }
      } else if (res.statusCode === 404) {
        callback('No record was found');
      } else if (res.statusCode === 400) {
        callback('Bad request');
      } else {
        callback('Connection error');
      }
    });
  }).on('error', function () {
    callback('Connection error');
  }).end();
};

Rpc.prototype._parse = function (tsv) {
  var lines = [], kv = [], ret = {};

  if (typeof tsv === 'string' && tsv.length > 0) {
    lines = tsv.replace(/\n$/, '').split('\n');

    for (var i = 0; i < lines.length; ++i) {
      kv = lines[i].split('\t');
      ret[kv[0]] = kv[1];
    }
  }

  return ret;
};

Rpc.prototype._parseBase64Encode = function (tsv, encoding) {
  var lines = [], kv = [], ret = {}, i = 0;

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

Rpc.prototype._parseURLEncode = function (tsv) {
  var lines = [], kv = [], ret = {};

  if (typeof tsv === 'string' && tsv.length > 0) {
    lines = tsv.replace(/\n$/, '').split('\n');

    for (var i = 0; i < lines.length; ++i) {
      kv = lines[i].split('\t');
      ret[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
    }
  }

  return ret;
};

module.exports = Rpc;
