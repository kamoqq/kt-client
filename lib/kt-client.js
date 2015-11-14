'use strict';

var http = require('http');

var Rest = require('./rest');
var Rpc = require('./rpc');

/**
 * get
 * @param {string} key - the name of the key
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
  */
function KyotoTocoon(options) {
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
KyotoTocoon.prototype.close = function() {
  this.agent.destroy();
};

/**
 * get
 * @param {string} key - the name of the key
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTocoon.prototype.get = function(key, options, callback) {
  this.rest.get(key, options, callback);
};

/**
 * set
 * @param {string} key - the name of the key
 * @param {string} key - value
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTocoon.prototype.set = function(key, value, options, callback) {
  this.rest.set(key, value, options, callback);
};

/**
 * add
 * @param {string} key - the name of the key
 * @param {string} key - value
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTocoon.prototype.add = function(key, value, options, callback) {
  this.rest.add(key, value, options, callback);
};

/**
 * replace
 * @param {string} key - the name of the key
 * @param {string} key - value
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTocoon.prototype.replace = function(key, value, options, callback) {
  this.rest.replace(key, value, options, callback);
};

/**
 * remove
 * @param {string} key - the name of the key
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTocoon.prototype.remove = function(key, options, callback) {
  this.rest.remove(key, options, callback);
};

/**
 * report
 * @param {callback} callback - the callback
 */
KyotoTocoon.prototype.report = function(callback) {
  this.rpc.report(callback);
};

/**
 * matchPrefix
 * @param {string} prefix - the prefix string
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTocoon.prototype.matchPrefix = function(prefix, options, callback) {
  this.rpc.matchPrefix(prefix, options, callback);
};

module.exports = KyotoTocoon;
