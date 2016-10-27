'use strict';

var LOM = require('./lom.model.js'),
    config = require('../../res/config.js'),
    async = require('async'),
    _ = require('lodash');

/**
 * Creates a new element
 */
exports.create = function(req, res) {
    res.status(200).json({
        element: req.body,
        date: Date.now()
    });
};




