'use strict';

/**
 * These functions are called from other modules
 * If you want to call one of these functions, you need to add this line in yours file:
 * var ExampleFunctions = require('../../example.functions.js'),
 */

var Example = require('./example.model.js'),
    config = require('../../res/config.js');

var myList = [];
/**
 * Add element and increase its counter
 * @param {Object} element
 * @return {Function} next
 */
exports.addElementInList = function(element, next) {
    myList.push(element);
    Example.increaseCounter(config.myNumber, next);
};

