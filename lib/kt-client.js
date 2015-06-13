'use strict';

var http = require('http');

var Rest = require('./rest');
//var Rpc = require('./rpc');

function KyotoTocoon(options) {
  var requestOptions = {};
  options = options || {};

  requestOptions.host = options.host || 'localhost';
  requestOptions.port = options.port || 1978;

  this.agent = new http.Agent({ keepAlive: true });

  this.rest = new Rest(this.agent, requestOptions);
  //this.rpcClient  = new Rpc(this.agent, requestOptions);
}

KyotoTocoon.prototype.close = function() {
  this.agent.destroy();
};

KyotoTocoon.prototype.get = function(key, options, callback) {
  this.rest.get(key, options, callback);
};

KyotoTocoon.prototype.set = function(key, value, options, callback) {
  this.rest.set(key, value, options, callback);
};

KyotoTocoon.prototype.add = function(key, value, options, callback) {
  this.rest.add(key, value, options, callback);
};

KyotoTocoon.prototype.replace = function(key, value, options, callback) {
  this.rest.replace(key, value, options, callback);
};

KyotoTocoon.prototype.remove = function(key, options, callback) {
  this.rest.remove(key, callback);
};

module.exports = KyotoTocoon;
