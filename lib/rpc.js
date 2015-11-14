'use strict';

var http = require('http');
var querystring = require('querystring');
var BufferList = require('bl');

function Rpc(agent, options) {
  this.agent = agent;
  this.host = options.host;
  this.port = options.port;
}

// Rpc.prototype.echo = function(options, callback) {};

Rpc.prototype.report = function(callback) {
  this._call('report', undefined, {}, callback);
};

// Rpc.prototype.playScript = function(options, callback) {};
// Rpc.prototype.tuneReplication = function(options, callback) {};
// Rpc.prototype.status = function(options, callback) {};
// Rpc.prototype.clear = function(options, callback) {};
// Rpc.prototype.synchronize = function(options, callback) {};
// Rpc.prototype.append = function(options, callback) {};
// Rpc.prototype.increment = function(options, callback) {};
// Rpc.prototype.incrementDouble = function(options, callback) {};
// Rpc.prototype.cas = function(options, callback) {};
// Rpc.prototype.check = function(options, callback) {};
// Rpc.prototype.seize = function(options, callback) {};
// Rpc.prototype.setBulk = function(options, callback) {};
// Rpc.prototype.removeBulk = function(options, callback) {};
// Rpc.prototype.getBulk = function(options, callback) {};
// Rpc.prototype.vacuum = function(options, callback) {};

Rpc.prototype.matchPrefix = function(prefix, options, callback) {
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

  cb = function(error, res) {
    callback(error, res);
  };

  this._call('match_prefix', {}, function(error, ret) {
    var data = {}, num;

    if (typeof error !== 'undefined') {
      cb(error);
    }

    for (var key in ret) {
      if (ret.hasOwnProperty(key)) {
        if (key === 'num') {
          num = ret[key];
        } else {
          data[key.substr(1)] = ret[key];
        }
      }
    }
    cb(undefined, data, num);
  });
};

// Rpc.prototype.matchRegex = function(options, callback) {};
// Rpc.prototype.matchSimilar = function(options, callback) {};
// Rpc.prototype.curJump = function(options, callback) {};
// Rpc.prototype.curJumpBack = function(options, callback) {};
// Rpc.prototype.curStep = function(options, callback) {};
// Rpc.prototype.curStepBack = function(options, callback) {};
// Rpc.prototype.curSetValue = function(options, callback) {};
// Rpc.prototype.curRemove = function(options, callback) {};
// Rpc.prototype.curGetGey = function(options, callback) {};
// Rpc.prototype.curGetValue = function(options, callback) {};
// Rpc.prototype.curGet = function(options, callback) {};
// Rpc.prototype.curSeize = function(options, callback) {};
// Rpc.prototype.curDelete = function(options, callback) {};

Rpc.prototype._call = function(method, params, options, callback) {
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

  http.request(requestOptions, function(res) {
    var buf = new BufferList(), str = '';

    res.on('data', function(chunk) {
      if (Buffer.isBuffer(chunk)) {
        buf.append(chunk);
      } else {
        str += chunk;
      }
    });

    res.on('end', function() {
      var ret;

      if (res.statusCode === 200) {
        if (buf.length) {
          // TSV-RPC response is string only
          ret = buf.toString();
        } else {
          ret = str;
        }

        if (typeof res.headers['Content-Type'] !== 'string') {
          callback(undefined, _this._parse(ret));
        } else if (res.headers['Content-Type'].indexOf('colenc=B')) {
          callback(undefined, _this._parseBase64Encode(ret, options.encode));
        } else if (res.headers['Content-Type'].indexOf('colenc=U')) {
          callback(undefined, _this._parseURLEncode(ret));
        } else {
          callback(undefined, _this._parse(ret));
        }
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

Rpc.prototype._parse = function(tsv) {
  var lines = [], kv = [], ret = {};

  if (typeof tsv === 'string' && tsv.length > 0) {
    lines = tsv.split('\n');

    for (var i = 0; i < lines.length; ++i) {
      kv = lines.split('\t');
      ret[kv[0]] = kv[1];
    }
  }

  return ret;
};

Rpc.prototype._parseBase64Encode = function(tsv, encode) {
  var lines = [], kv = [], ret = {}, i = 0;

  if (typeof tsv === 'string' && tsv.length > 0) {
    lines = tsv.split('\n');

    if (typeof encode === 'undefined' || encode === null) {
      for (; i < lines.length; ++i) {
        kv = lines.split('\t');
        ret[new Buffer(kv[0], 'base64').toString()] =
        new Buffer(kv[1], 'base64').toString();
      }
    } else if (encode === 'binary') {
      for (; i < lines.length; ++i) {
        kv = lines.split('\t');
        ret[new Buffer(kv[0], 'base64').toString()] = new Buffer(kv[1], 'base64');
      }
    } else {
      for (; i < lines.length; ++i) {
        kv = lines.split('\t');
        ret[new Buffer(kv[0], 'base64').toString(encode)] =
        new Buffer(kv[1], 'base64').toString(encode);
      }
    }
  }

  return ret;
};

Rpc.prototype._parseURLEncode = function(tsv) {
  var lines = [], kv = [], ret = {};

  if (typeof tsv === 'string' && tsv.length > 0) {
    lines = tsv.split('\n');

    for (var i = 0; i < lines.length; ++i) {
      kv = lines.split('\t');
      ret[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
    }
  }

  return ret;
};

module.exports = Rpc;
