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
 * @package    collections
 * @author     Ignacio R. Galieri <irgalieri@gmail.com>
 * @copyright  2016 Mule Dojo
 * @license    GPL-3.0
 * @link       https://github.com/MuleDojo/stackrank
 */
"use strict";
var User = require('../models/user.js');
var Task = require('../models/task.js');

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
    /**
     * findUser
     *
     * Find User
     *
     * @param  {String}   email    Email to find user
     * @param  {Function} callback Callback
     *
     * @return void
     * @api public
     */
    findUser(email, callback) {
        if (this.connection === null) {
            return callback(true, "You must set connection first", null);
        }
        if (!email) {
            return callback(true, "email must be not empty", null);
        }
        var collection = this.connection.collection('users');
        collection.find({email: email}).toArray(function (error, items) {
            var user = null;
            /* istanbul ignore else */
            if (items.length === 1) {
                var user = new User;
                user._id = items[0]._id;
                user.firstname = items[0].firstname;
                user.lastname = items[0].lastname;
                user.email = items[0].email;
                for (let index in items[0].tasks) {
                    let elem = items[0].tasks[index];
                    let task = new Task;
                    task._id = elem._id;
                    task.tittle = elem.tittle;
                    task.status = elem.status;
                    task.doDate = elem.doDate;
                    task.dateAdmission = elem.dateAdmission;
                    task.urgency = elem.urgency;
                    task.importance = elem.importance;
                    user.addTask(task);
                }
            }
            /* istanbul ignore next */
            return callback(
                (error !== null),
                (error !== null)? error.message: "",
                user
            );
        });
    }
    /**
     * updateUser
     *
     * Update User in Data Base.
     *
     * @param  {User}     user     User to Update
     * @param  {Function} callback Callback
     *
     * @return void
     * @api public
     */
    updateUser(user, callback) {
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
            let obj = {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                tasks: user.tasks
            }
            collection.updateOne({email: user.email}, {$set:obj}, function(error, result) {
                /* istanbul ignore next */
                return callback((error !== null), (error !== null)? error.message: "");
            });
        });
    }
}

module.exports = Users;
