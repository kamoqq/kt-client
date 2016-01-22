'use strict';

var http = require('http');

var Rest = require('./rest');
var Rpc = require('./rpc');

/**
 * KyotoTycoon
 * @param {string} key - the name of the key
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
  */
function KyotoTycoon(options) {
  var opt = {};

  if (typeof options !== 'undefined' && options !== null) {
    opt = options;
  }

  var requestOptions = {};

  if (typeof opt.host !== 'undefined' && opt.host !== null) {
    requestOptions.host = opt.host;
  } else {
    requestOptions.host = 'localhost';
  }

  if (typeof opt.port !== 'undefined' && opt.port !== null) {
    requestOptions.port = opt.port;
  } else {
    requestOptions.port = 1978;
  }

  this.agent = new http.Agent({ keepAlive: true });

  this.rest = new Rest(this.agent, requestOptions);
  this.rpc = new Rpc(this.agent, requestOptions);
}

/**
 * close
 */
KyotoTycoon.prototype.close = function () {
  this.agent.destroy();
};

/**
 * get
 * @param {string} key - the name of the key
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.get = function (key, options, callback) {
  this.rest.get(key, options, callback);
};

/**
 * set
 * @param {string} key - the name of the key
 * @param {string} key - value
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.set = function (key, value, options, callback) {
  this.rest.set(key, value, options, callback);
};

/**
 * add
 * @param {string} key - the name of the key
 * @param {string} key - value
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.add = function (key, value, options, callback) {
  this.rest.add(key, value, options, callback);
};

/**
 * replace
 * @param {string} key - the name of the key
 * @param {string} key - value
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.replace = function (key, value, options, callback) {
  this.rest.replace(key, value, options, callback);
};

/**
 * remove
 * @param {string} key - the name of the key
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.remove = function (key, options, callback) {
  this.rest.remove(key, options, callback);
};

/**
 * void
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.void = function (callback) {
  this.rpc.void(callback);
};

/**
 * echo
 * @param {Object} params - arbitrary records
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.echo = function (params, callback) {
  this.rpc.echo(params, callback);
};

/**
 * report
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.report = function (callback) {
  this.rpc.report(callback);
};

/**
 * status
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.status = function (options, callback) {
  this.rpc.status(options, callback);
};

/**
 * clear
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.clear = function (options, callback) {
  this.rpc.clear(options, callback);
};

/**
 * append
 * @param {string} key - the key of the record
 * @param {string} value - the value of the record
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.append = function (key, value, options, callback) {
  this.rpc.append(key, value, options, callback);
};

/**
 * check
 * @param {string} key - the key of the record
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.check = function (key, options, callback) {
  this.rpc.check(key, options, callback);
};

/**
 * seize
 * @param {string} key - the key of the record
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.seize = function (key, options, callback) {
  this.rpc.seize(key, options, callback);
};

/**
 * vacuum
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.vacuum = function (options, callback) {
  this.rpc.vacuum(options, callback);
};

/**
 * matchPrefix
 * @param {string} prefix - the prefix string
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.matchPrefix = function (prefix, options, callback) {
  this.rpc.matchPrefix(prefix, options, callback);
};

/**
 * matchRegex
 * @param {string} regex - the regular expression string
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.matchRegex = function (regex, options, callback) {
  this.rpc.matchRegex(regex, options, callback);
};

module.exports = KyotoTycoon;
