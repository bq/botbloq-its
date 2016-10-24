'use strict';

var mongoose = require('mongoose');

var CoursesSchema = new mongoose.Schema(
	{
	"name": { type: String, trim: true, required: true },
	"content": { type: String, trim: true },
	"objetives": { type: String, trim: true },
	"bibliography": { type: String, trim: true }
	}, 
	{ timestamps: true }
	);

/**
 * Virtuals: commented until I understand its role
 */

// Public profile information
// CoursesSchema
    // .virtual('profile')
    // .get(function() {
        // return {
            // 'author': this.author,
            // 'email': this.email
        // };
    // });


/**
 * Validations: commented until I understand its role
 */

// Validate email is not taken
// CoursesSchema
    // .path('email')
    // .validate(function(value, respond) {
        // var self = this,
            // exists = false;
        // this.constructor.findOne({
            // username: value
        // }, function(err, user) {
            // if (!user || self.id !== user.id) {
                // exists = true;
            // }
            // return respond(true);
        // })
    // }, 'The specified email address is already in use.');


/**
 * Pre-save hook: commented until I understand its role
 */
// CoursesSchema
    // .pre('save', function(next) {
        // if (this.title) {
            // console.log('Title element: ', this.title);
        // }
        // next();
    // });

/**
 * Methods: commented until I understand its role
 */
// CoursesSchema.methods = {
    // /**
     // * increaseCounter - Increase the counter
     // *
     // * @param {Number} addNumber
     // * @param {Function} callback
     // * @api public
     // */

    // increaseCounter: function(number, callback) {
        // this.counter = this.counter + number;
        // callback(null, this.counter);
    // }
// };

module.exports = mongoose.model('Courses', CoursesSchema);
