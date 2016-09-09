'use strict';

var mongoose = require('mongoose');

var ExampleSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    author: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    counter: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

/**
 * Virtuals
 */

// Public profile information
ExampleSchema
    .virtual('profile')
    .get(function() {
        return {
            'author': this.author,
            'email': this.email
        };
    });


/**
 * Validations
 */

// Validate email is not taken
ExampleSchema
    .path('email')
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
    }, 'The specified email address is already in use.');


/**
 * Pre-save hook
 */
ExampleSchema
    .pre('save', function(next) {
        if (this.title) {
            console.log('Title element: ', this.title);
        }
        next();
    });

/**
 * Methods
 */
ExampleSchema.methods = {
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

module.exports = mongoose.model('Example', ExampleSchema);
