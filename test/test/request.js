'use strict';
var chakram = require('chakram'),
    expect = chakram.expect,
    argv = require('yargs').argv;


var Request = function() {

    var host = "http://127.0.0.1:8000/botbloq/v1/its";

    this.postBackend =function(path,status,params,headers) {
      return chakram.post(host+path,params,headers).then(function(response) {
         expect(response).to.have.status(status);
         return response;
      });
    };

    this.getBackend =function(path,status,headers) {
      return chakram.get(host+path,headers).then(function(response) {
        expect(response).to.have.status(status);
        return response;
      });
    };

    this.headBackend =function(path,status,params,headers) {
      return chakram.head(host+path,params,headers).then(function(response) {
        expect(response).to.have.status(status);
        return response;
      });
    };

    this.putBackend = function(path,status,params,headers) {
      return chakram.put(host+path,params,headers).then(function(response) {
        expect(response).to.have.status(status);
        return response;
      });
    };
/*
    this.postCompiler =function(path,status,params,headers) {
      return chakram.post(this.config.env[argv.env].compiler+path,params,headers).then(function(response) {
        expect(response).to.have.status(status);
         return response;
      });
    };
*/

};
module.exports = Request;