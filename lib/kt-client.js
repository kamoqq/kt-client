'use strict';

var http = require('http');

var RestClient = require('./rest');
//var RpcClient = require('./rpc');

function KyotoTocoon(options) {
  var requestOptions = {};
  options = options || {};

  requestOptions.host = options.host || 'localhost';
  requestOptions.port = options.port || 1978;

  this.agent = new http.Agent({ keepAlive: true });

  this.restClient = new RestClient(this.agent, requestOptions);
  //this.rpcClient  = new RpcClient(this.agent, requestOptions);
}

KyotoTocoon.prototype.close = function() {
  this.agent.destroy();
};

KyotoTocoon.prototype.get = function(key, options, callback) {
  this.restClient.get(key, options, callback);
};

KyotoTocoon.prototype.set = function(key, value, options, callback) {
  this.restClient.set(key, value, options, callback);
};

KyotoTocoon.prototype.add = function(key, value, options, callback) {
  this.restClient.add(key, value, options, callback);
};

KyotoTocoon.prototype.replace = function(key, value, options, callback) {
  this.restClient.replace(key, value, options, callback);
};

KyotoTocoon.prototype.remove = function(key, value, options, callback) {
  this.restClient.remove(key, value, options, callback);
};

module.exports = KyotoTocoon;
