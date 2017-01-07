'use strict';

const http = require('http');

const Rest = require('./rest');
const Rpc = require('./rpc');

/**
 * KyotoTycoon
 * @param {string} key - the name of the key
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
  */
function KyotoTycoon(options) {
  let opt = {};

  if (typeof options !== 'undefined' && options !== null) {
    opt = options;
  }

  const requestOptions = {};

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
KyotoTycoon.prototype.close = () => {
  this.agent.destroy();
};

/**
 * get
 * @param {string} key - the name of the key
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.get = (key, options, callback) => {
  this.rest.get(key, options, callback);
};

/**
 * set
 * @param {string} key - the name of the key
 * @param {string} value - value
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.set = (key, value, options, callback) => {
  this.rest.set(key, value, options, callback);
};

/**
 * add
 * @param {string} key - the name of the key
 * @param {string} value - value
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.add = (key, value, options, callback) => {
  this.rest.add(key, value, options, callback);
};

/**
 * replace
 * @param {string} key - the name of the key
 * @param {string} value - value
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.replace = (key, value, options, callback) => {
  this.rest.replace(key, value, options, callback);
};

/**
 * remove
 * @param {string} key - the name of the key
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.remove = (key, options, callback) => {
  this.rest.remove(key, options, callback);
};

/**
 * void
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.void = (callback) => {
  this.rpc.void(callback);
};

/**
 * echo
 * @param {Object} params - arbitrary records
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.echo = (params, callback) => {
  this.rpc.echo(params, callback);
};

/**
 * report
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.report = (callback) => {
  this.rpc.report(callback);
};

/**
 * status
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.status = (options, callback) => {
  this.rpc.status(options, callback);
};

/**
 * clear
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.clear = (options, callback) => {
  this.rpc.clear(options, callback);
};

/**
 * append
 * @param {string} key - the key of the record
 * @param {string} value - the value of the record
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.append = (key, value, options, callback) => {
  this.rpc.append(key, value, options, callback);
};

/**
 * increment
 * @param {string} key - the key of the record
 * @param {number} num - the additional number
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.increment = (key, num, options, callback) => {
  this.rpc.increment(key, num, options, callback);
};

/**
 * incrementDouble
 * @param {string} key - the key of the record
 * @param {number} num - the additional number
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.incrementDouble = (key, num, options, callback) => {
  this.rpc.incrementDouble(key, num, options, callback);
};

/**
 * cas
 * @param {string} key - the key of the record
 * @param {string} oldValue - the old value
 * @param {string} newValue - the new value
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.cas = (key, oldValue, newValue, options, callback) => {
  this.rpc.cas(key, oldValue, newValue, options, callback);
};

/**
 * check
 * @param {string} key - the key of the record
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.check = (key, options, callback) => {
  this.rpc.check(key, options, callback);
};

/**
 * seize
 * @param {string} key - the key of the record
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.seize = (key, options, callback) => {
  this.rpc.seize(key, options, callback);
};

/**
 * setBulk
 * @param {Object} records - the records
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.setBulk = (records, options, callback) => {
  this.rpc.setBulk(records, options, callback);
};

/**
 * removeBulk
 * @param {Array} keys - the key of the record
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.removeBulk = (keys, options, callback) => {
  this.rpc.removeBulk(keys, options, callback);
};

/**
 * getBulk
 * @param {Array} keys - the key of the record
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.getBulk = (keys, options, callback) => {
  this.rpc.getBulk(keys, options, callback);
};

/**
 * vacuum
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.vacuum = (options, callback) => {
  this.rpc.vacuum(options, callback);
};

/**
 * matchPrefix
 * @param {string} prefix - the prefix string
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.matchPrefix = (prefix, options, callback) => {
  this.rpc.matchPrefix(prefix, options, callback);
};

/**
 * matchRegex
 * @param {string} regex - the regular expression string
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.matchRegex = (regex, options, callback) => {
  this.rpc.matchRegex(regex, options, callback);
};

/**
 * matchSimilar
 * @param {string} origin - the origin string
 * @param {Object} [options] - options
 * @param {callback} callback - the callback
 */
KyotoTycoon.prototype.matchSimilar = (origin, options, callback) => {
  this.rpc.matchSimilar(origin, options, callback);
};

module.exports = KyotoTycoon;
