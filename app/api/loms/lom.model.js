'use strict';

var mongoose = require('mongoose');

var LOMSchema = new mongoose.Schema({
    title: {
        type: String,
		required:true,
        trim: true
    },
    status: {
        type: String,
        trim: true
    },
    author: {
        type: String,
        trim: true
    },
    counter: {
        type: Number,
        default: 0
    }
	_id: false

}, {
    timestamps: true
});

/**
 * Virtuals
 */

// Public profile information
LOMSchema
    .virtual('profile')
    .get(function() {
        return {
            'title': this.title,
        };
    });


/**
 * Validations
 */

// Validate title is not taken
LOMSchema
    .path('title')
    .validate(function(value, respond) {
        var self = this,
            exists = false;
        this.constructor.findOne({
            username: value
        }, function(err, user) {
            if (!user || self.id !== user.id) {
                exists = true;
            }
            return respond(true);
        })
    }, 'The specified name is already in use.');


/**
 * Pre-save hook
 */
LOMSchema
    .pre('save', function(next) {
        if (this.title) {
            console.log('Title element: ', this.title);
        }
        next();
    });

/**
 * Methods
 */
LOMSchema.methods = {
    /**
     * increaseCounter - Increase the counter
     *
     * @param {Number} addNumber
     * @param {Function} callback
     * @api public
     */

    increaseCounter: function(number, callback) {
        this.counter = this.counter + number;
        callback(null, this.counter);
    }
};

module.exports = mongoose.model('LOM', LOMSchema);
