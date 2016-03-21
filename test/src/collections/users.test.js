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
 * @category   Test
 * @package    TestSuite
 * @author     Ignacio R. Galieri <irgalieri@gmail.com>
 * @copyright  2016 Mule Dojo
 * @license    GPL-3.0
 * @link       https://github.com/nachonerd/memqueue
 */
"use strict";

var path = require('path');
var rootPath = path.normalize(path.dirname(require.main.filename) + "/../../../");
var User = require(rootPath+'src/models/user.js');
var Task = require(rootPath+'src/models/task.js');
var Users = require(rootPath+'src/collections/users.js');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

describe('Users', function() {
    context('Create Users Collections', function () {
        it('Exits the Collections Users.', function(done){
            let obj = new Users;
            obj.should.be.instanceof(Users, 'The Class Users No Exist');
            done();
        });
        it('Have property connection.', function(done){
            let obj = new Users;
            obj.should.have.properties('connection');
            done();
        });
    });
    context('Operations Over MongoDB', function () {
        var connection = null;
        before(function(done) {
            var url = 'mongodb://localhost/stackrank';
            MongoClient.connect(url, function(err, db) {
                assert.equal(null, err);
                connection = db;
                done();
            });
        });
        after(function(done) {
            if (connection !== null) {
                let collection = connection.collection('users');
                collection.deleteMany({});
                connection.close();
            }
            done();
        });
        it('Create New User - Fail because connection is NULL.', function(done){
            let obj = new Users;
            obj.connection = null;
            let user = "John Doe";
            obj.insertUser(user, function(error, message) {
                error.should.be.eql(true);
                message.should.be.eql("You must set connection first");
                done();
            });
        });
        it('Create New User - Fail because Obj is "John Doe".', function(done){
            let obj = new Users;
            obj.connection = connection;
            let user = "John Doe";
            obj.insertUser(user, function(error, message) {
                error.should.be.eql(true);
                message.should.be.eql("user must be instance of User class");
                done();
            });
        });
        it('Create New User - Fail because Obj is 100.', function(done){
            let obj = new Users;
            obj.connection = connection;
            let user = 100;
            obj.insertUser(user, function(error, message) {
                error.should.be.eql(true);
                message.should.be.eql("user must be instance of User class");
                done();
            });
        });
        it('Create New User - Fail because Obj is null.', function(done){
            let obj = new Users;
            obj.connection = connection;
            let user = null;
            obj.insertUser(user, function(error, message) {
                error.should.be.eql(true);
                message.should.be.eql("user must be instance of User class");
                done();
            });
        });
        it('Create New User - Fail because Obj no is instance of User.', function(done){
            let obj = new Users;
            obj.connection = connection;
            let user = {};
            obj.insertUser(user, function(error, message) {
                error.should.be.eql(true);
                message.should.be.eql("user must be instance of User class");
                done();
            });
        });
        it('Create New User - Success.', function(done){
            var collection = connection.collection('users');
            let obj = new Users;
            let user = new User;
            user.firstname = "John";
            user.lastname = "Doe";
            user.email = "john.doe@domain.com";
            obj.connection = connection;
            obj.insertUser(user, function(error, message) {
                error.should.be.eql(false);
                message.should.be.eql("");
                collection.find({}).toArray(function(err, docs) {
                    docs.length.should.be.eql(1);
                    docs[0].firstname.should.be.eql("John");
                    docs[0].lastname.should.be.eql("Doe");
                    docs[0].email.should.be.eql("john.doe@domain.com");
                    docs[0].tasks.length.should.be.eql(0);
                    collection.deleteMany({});
                    collection.find().toArray(function(err, docs) {
                      assert.equal(null, err);
                      docs.length.should.be.eql(0);
                      done();
                    });
                });
            });
        });
        it('Remove User - Fail because connection is NULL.', function(done){
            let obj = new Users;
            obj.connection = null;
            let user = "John Doe";
            obj.removeUser(user, function(error, message) {
                error.should.be.eql(true);
                message.should.be.eql("You must set connection first");
                done();
            });
        });
        it('Remove User - Fail because Obj is "John Doe".', function(done){
            let obj = new Users;
            obj.connection = connection;
            let user = "John Doe";
            obj.removeUser(user, function(error, message) {
                error.should.be.eql(true);
                message.should.be.eql("user must be instance of User class");
                done();
            });
        });
        it('Remove User - Fail because Obj is 100.', function(done){
            let obj = new Users;
            obj.connection = connection;
            let user = 100;
            obj.removeUser(user, function(error, message) {
                error.should.be.eql(true);
                message.should.be.eql("user must be instance of User class");
                done();
            });
        });
        it('Remove User - Fail because Obj is null.', function(done){
            let obj = new Users;
            obj.connection = connection;
            let user = null;
            obj.removeUser(user, function(error, message) {
                error.should.be.eql(true);
                message.should.be.eql("user must be instance of User class");
                done();
            });
        });
        it('Remove User - Fail because Obj no is instance of User.', function(done){
            let obj = new Users;
            obj.connection = connection;
            let user = {};
            obj.removeUser(user, function(error, message) {
                error.should.be.eql(true);
                message.should.be.eql("user must be instance of User class");
                done();
            });
        });
        it('Remove User - Fail becuase user not found.', function(done){
            var collection = connection.collection('users');
            var obj = new Users;
            var user = new User;
            user.firstname = "John";
            user.lastname = "Doe";
            user.email = "john.doe@domain.com";
            obj.connection = connection;
            obj.removeUser(user, function (error, message) {
                error.should.be.eql(true);
                message.should.be.eql("user not found");
                done();
            });
        });
        it('Remove User - Success.', function(done){
            var collection = connection.collection('users');
            var obj = new Users;
            var user = new User;
            user.firstname = "John";
            user.lastname = "Doe";
            user.email = "john.doe@domain.com";
            obj.connection = connection;
            obj.insertUser(user, function(error, message) {
                error.should.be.eql(false);
                message.should.be.eql("");
                obj.removeUser(user, function (error, message) {
                    error.should.be.eql(false);
                    message.should.be.eql("");
                    done();
                });
            });
        });
        it('Find User - Fail because connection is null.', function(done){
            var collection = connection.collection('users');
            var obj = new Users;
            obj.connection = null;
            var user = new User;
            obj.findUser(null, function (error, message, result) {
                error.should.be.eql(true);
                message.should.be.eql('You must set connection first');
                assert.equal(null, result);
                done();
            });
        });
        it('Find User - Fail because mail is null.', function(done){
            var collection = connection.collection('users');
            var obj = new Users;
            obj.connection = connection;
            var user = new User;
            obj.findUser(null, function (error, message, result) {
                error.should.be.eql(true);
                message.should.be.eql('email must be not empty');
                assert.equal(null, result);
                done();
            });
        });
        it('Find User - Fail because mail is "".', function(done){
            var collection = connection.collection('users');
            var obj = new Users;
            obj.connection = connection;
            var user = new User;
            obj.findUser('', function (error, message, result) {
                error.should.be.eql(true);
                message.should.be.eql('email must be not empty');
                assert.equal(null, result);
                done();
            });
        });
        it('Find User - Success User without Tasks.', function(done){
            var collection = connection.collection('users');
            var obj = new Users;
            var user = new User;
            user.firstname = "John";
            user.lastname = "Doe";
            user.email = "john.doe@domain.com";
            obj.connection = connection;
            obj.insertUser(user, function(error, message) {
                error.should.be.eql(false);
                message.should.be.eql("");
                obj.findUser(user.email, function (error, message, result) {
                    error.should.be.eql(false);
                    message.should.be.eql('');
                    result._id.should.be.not.eql(null);
                    result.email.should.be.eql(user.email);
                    result.firstname.should.be.eql(user.firstname);
                    result.lastname.should.be.eql(user.lastname);
                    result.tasks.should.be.eql([]);
                    obj.removeUser(user, function (error, message) {
                        error.should.be.eql(false);
                        message.should.be.eql("");
                        done();
                    });
                });
            });
        });
        it('Find User - Success User with two Tasks.', function(done){
            var collection = connection.collection('users');
            var obj = new Users;
            var user = new User;
            user.firstname = "John";
            user.lastname = "Doe";
            user.email = "john.doe@domain.com";
            obj.connection = connection;
            var task1 = new Task();
            task1.tittle = 'First';
            task1.urgency = 10;
            var task2 = new Task();
            task2.tittle = 'Second';
            user.addTask(task1);
            user.addTask(task2);
            obj.insertUser(user, function(error, message) {
                error.should.be.eql(false);
                message.should.be.eql("");
                obj.findUser(user.email, function (error, message, result) {
                    error.should.be.eql(false);
                    message.should.be.eql('');
                    result._id.should.be.not.eql(null);
                    result.email.should.be.eql(user.email);
                    result.firstname.should.be.eql(user.firstname);
                    result.lastname.should.be.eql(user.lastname);
                    result.tasks.length.should.be.eql(2);
                    task1._id = result.tasks[0]._id;
                    task2._id = result.tasks[1]._id;
                    result.tasks[0].should.deepEqual(task1);
                    result.tasks[1].should.deepEqual(task2);
                    obj.removeUser(user, function (error, message) {
                        error.should.be.eql(false);
                        message.should.be.eql("");
                        done();
                    });
                });
            });
        });
        it('Update User - Fail beacuase connection is null', function(done){
            var collection = connection.collection('users');
            var obj = new Users;
            obj.connection = null;
            var user = new User;
            obj.updateUser(null, function (error, message) {
                error.should.be.eql(true);
                message.should.be.eql('You must set connection first');
                done();
            });
        });
        it('Update User - Fail because Obj is "John Doe".', function(done){
            let obj = new Users;
            obj.connection = connection;
            let user = "John Doe";
            obj.updateUser(user, function(error, message) {
                error.should.be.eql(true);
                message.should.be.eql("user must be instance of User class");
                done();
            });
        });
        it('Update User - Fail because Obj is 100.', function(done){
            let obj = new Users;
            obj.connection = connection;
            let user = 100;
            obj.updateUser(user, function(error, message) {
                error.should.be.eql(true);
                message.should.be.eql("user must be instance of User class");
                done();
            });
        });
        it('Update User - Fail because Obj is null.', function(done){
            let obj = new Users;
            obj.connection = connection;
            let user = null;
            obj.updateUser(user, function(error, message) {
                error.should.be.eql(true);
                message.should.be.eql("user must be instance of User class");
                done();
            });
        });
        it('Update User - Fail because Obj no is instance of User.', function(done){
            let obj = new Users;
            obj.connection = connection;
            let user = {};
            obj.updateUser(user, function(error, message) {
                error.should.be.eql(true);
                message.should.be.eql("user must be instance of User class");
                done();
            });
        });
        it('Update User - Fail because user not found.', function(done){
            let obj = new Users;
            obj.connection = connection;
            var user = new User;
            user.firstname = "John";
            user.lastname = "Doe";
            user.email = "john.doe@domain.com";
            obj.updateUser(user, function(error, message) {
                error.should.be.eql(true);
                message.should.be.eql("user not found");
                done();
            });
        });
        it('Update User - Success.', function(done){
            var collection = connection.collection('users');
            var obj = new Users;
            var user = new User;
            user.firstname = "John";
            user.lastname = "Doe";
            user.email = "john.doe@domain.com";
            obj.connection = connection;
            var task1 = new Task();
            task1.tittle = 'First';
            task1.urgency = 10;
            var task2 = new Task();
            task2.tittle = 'Second';
            task2.urgency = 100;
            user.addTask(task1);
            user.addTask(task2);
            obj.insertUser(user, function(error, message) {
                error.should.be.eql(false);
                message.should.be.eql("");
                obj.findUser(user.email, function (error, message, userToUp) {
                    error.should.be.eql(false);
                    message.should.be.eql("");
                    userToUp.firstname = 'Juan';
                    userToUp.sortTasks(function (error) {
                        error.should.be.eql(false);
                        obj.updateUser(userToUp, function (error, message) {
                            error.should.be.eql(false);
                            message.should.be.eql('');
                            obj.findUser(user.email, function (error, message, userToCheck) {
                                error.should.be.eql(false);
                                message.should.be.eql("");
                                userToUp.tasks[0]._id = userToCheck.tasks[0]._id;
                                userToUp.tasks[1]._id = userToCheck.tasks[1]._id;
                                userToCheck.should.deepEqual(userToUp);
                                obj.removeUser(userToCheck, function (error, message) {
                                    error.should.be.eql(false);
                                    message.should.be.eql("");
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
