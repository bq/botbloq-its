'use strict';

var configJson = require('./config/config.json');


/**
 *  config.json base:
 *
 * {
 *        "env": "local",
 *    
 *        "port": 8000,
 *    
 *        "mongo": {
 *        "uri": "mongodb://127.0.0.1:27018/bitbloq",
 *            "options": {
 *            "db": {
 *                "safe": true
 *            }
 *        }
 *    },
 *    
 *        "myNumber": 2
 *    
 * }
 *
 */


// Development specific configuration
// ==================================
module.exports = configJson;
