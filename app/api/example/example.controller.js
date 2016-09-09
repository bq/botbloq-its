'use strict';

var Example = require('./example.model.js'),
    config = require('../../res/config.js'),
    async = require('async'),
    _ = require('lodash');

/**
 * Show a single profile element
 */
exports.show = function(req, res) {

    var elementId = req.params.id;

    /**
     * with bbdd connection
     Example.findById(userId, function(err, element) {
        if (err) {
            res.status(500).send(err);
        } else if (element) {
            res.status(200).json(element.profile);
        } else {
            res.sendStatus(404);
        }
    });
     */

    res.send('Element: ' + elementId);
};


/**
 * Creates a new element
 */
exports.create = function(req, res) {
    res.status(200).json({
        element: req.body,
        date: Date.now()
    });
};

/**
 * Update my element
 */

exports.update = function(req, res) {
    res.sendStatus(403);
};


/**
 * Returns if an email exists
 */
exports.emailExists = function(req, res) {
    var email = req.params.username;

    Example.findOne({
        email: email
    }, function(err, user) {
        if (err) {
            res.status(500).send(err);
        } else if (user) {
            res.status(200).set({
                'exists': true
            }).send();
        } else {
            res.status(204).set({
                'exists': false
            }).send();
        }
    });
};


/**
 * Deletes a element
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {

    /**
     * async example:

     var userId = req.user._id,
         projectId = req.params.id;
     async.waterfall([
         Project.findById.bind(Project, projectId),
         function(project, next) {
                        if (project) {
                            if (project.isOwner(userId)) {
                                Project.findByIdAndRemove(projectId, next);
                            } else {
                                next(401);
                            }
                        } else {
                            next(404);
                        }
                    },
         function(project, next) {
                        ImageFunctions.delete('project', projectId, function() {
                            next();
                        });
                    }

     ], function(err) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(204).end();
            }
        });
     */

    res.status(200).send(req.params.id);

};