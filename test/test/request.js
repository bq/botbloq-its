'use strict';
var chakram = require('chakram'),
    expect = chakram.expect,
    argv = require('yargs').argv;


var Request = function() {

    
    this.config = require('../../app/res/config/config.json');
    var host = this.config.host; // 


    this.postBackend =function(path,status,params,headers) {
      return chakram.post(host+path,params,headers).then(function(response) {
         expect(response).to.have.status(status);
         return response;
      });
    };
	
    this.lockBackend =function(path,status,params,headers) {
      return chakram.request('LOCK', host+path,params,headers).then(function(response) {
         expect(response).to.have.status(status);
         return response;
      });
    };
	
    this.unlockBackend =function(path,status,params,headers) {
      return chakram.request('UNLOCK', host+path,params,headers).then(function(response) {
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
	
    this.deleteBackend = function(path,status,params,headers) {
      return chakram.delete(host+path,params,headers).then(function(response) {
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