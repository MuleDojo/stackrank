/**
 * Stack Rank
 * Copyright (C) 2016 Mule Dojo
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @category   Code
 * @package    helpers
 * @author     Ignacio R. Galieri <irgalieri@gmail.com>
 * @copyright  2016 Mule Dojo
 * @license    GPL-3.0
 * @link       https://github.com/MuleDojo/stackrank
 */
"use strict";
var User = require('../models/user.js');

class Users {
    /**
     * Constructor
     *
     * @constructor
     * @api public
     */
    constructor () {
        this.connection = null;
    }
    /**
     * insertUser
     *
     * Insert New User into Data Base.
     *
     * @param  {User}     user     User to Insert
     * @param  {Function} callback Callback
     *
     * @return void
     * @api public
     */
    insertUser(user, callback) {
        if (this.connection === null) {
            return callback(true, "You must set connection first");

        }
        if (!(user instanceof User)) {
            return callback(true, "user must be instance of User class");
        }
        let obj = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            tasks: user.tasks
        }
        let collection = this.connection.collection('users');
        collection.insertOne(obj, function(error, result) {
            /* istanbul ignore next */
            return callback((error !== null), (error !== null)? error.message: "");
        });
    }
    /**
     * removeUser
     *
     * Remove User from Data Base.
     *
     * @param  {User}     user     User to Remove
     * @param  {Function} callback Callback
     *
     * @return void
     * @api public
     */
    removeUser(user, callback) {
        if (this.connection === null) {
            return callback(true, "You must set connection first");

        }
        if (!(user instanceof User)) {
            return callback(true, "user must be instance of User class");
        }
        var collection = this.connection.collection('users');
        collection.find({email: user.email}).toArray(function (error, items) {
            /* istanbul ignore if */
            if (error !== null) {
                return callback(true, error.message);
            }
            if (items.length === 0) {
                return callback(true, "user not found");
            }
            collection.deleteOne({email: user.email}, function(error, result) {
                /* istanbul ignore next */
                return callback((error !== null), (error !== null)? error.message: "");
            });
        });
    }
}

module.exports = Users;
