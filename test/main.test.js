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
var io = require('socket.io-client');

// Version 1
// - debe ser una lista ordenada (urgencia-importancia-fecha ingreso, en ese orden), que contenga los campos urgencia, importancia, titulo fecha de ingreso, fecha estimada de finalizacion.
// - al agregarse una nueva tarea, debe reorganizarse automaticamente y reordenar las demas
// - todos los campos de la lista deben ser editables inline
// - los items de la lista, deben poder marcarse como finalizados
// - deben poder ver,ocultar??  los items ya marcados como finalizados

describe('WebSocket', function() {
    context('Create User', function () {
        var connection = null;
        var db = null;
        beforeEach(function(done) {
            var url = 'mongodb://localhost/stackrank';
            MongoClient.connect(url, function(err, result) {
                assert.equal(null, err);
                db = result;
                let socketURL = 'ws://localhost:8080';
                let options ={
                    transports: ['websocket'],
                    'force new connection': true
                };
                connection = io.connect(socketURL, options);
                connection.on('connect', function() {
                    done();
                });
            });
        });
        afterEach(function(done) {
            if (connection !== null) {
                let collection = db.collection('users');
                collection.deleteMany({});
                db.close();
                connection.disconnect();
            }
            connection = null;
            done();
        });
        it('Fail because user is empty.', function(done){
            connection.emit('create_user', null);
            connection.on('create_user_response', function (response) {
                response.messages.should.deepEqual([{field: 'all', message: 'user must be not empty'}]);
                done();
            });
        });
        it('Fail because user have email empty.', function(done){
            var user = {};
            user.email = '';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = [];
            connection.emit('create_user', user);
            connection.on('create_user_response', function (response) {
                response.messages.should.deepEqual([{field: 'email',  message: 'wrong format'}]);
                done();
            });
        });
        it('Fail because user have email wrong formated.', function(done){
            var user = {};
            user.email = 'john.doedomain.com';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = [];
            connection.emit('create_user', user);
            connection.on('create_user_response', function (response) {
                response.messages.should.deepEqual([{field: 'email',  message: 'wrong format'}]);
                done();
            });
        });
        it('Fail because user have firstname empty.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = '';
            user.lastname = 'Doe';
            user.tasks = [];
            connection.emit('create_user', user);
            connection.on('create_user_response', function (response) {
                response.messages.should.deepEqual([{field: 'firstname',  message: 'wrong format'}]);
                done();
            });
        });
        it('Fail because user have firstname wrong formated.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John Doe';
            user.lastname = 'Doe';
            user.tasks = [];
            connection.emit('create_user', user);
            connection.on('create_user_response', function (response) {
                response.messages.should.deepEqual([{field: 'firstname',  message: 'wrong format'}]);
                done();
            });
        });
        it('Fail because user have lastname empty.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = '';
            user.tasks = [];
            connection.emit('create_user', user);
            connection.on('create_user_response', function (response) {
                response.messages.should.deepEqual([{field: 'lastname',  message: 'wrong format'}]);
                done();
            });
        });
        it('Fail because user have lastname wrong formated.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = 'Doe, John';
            user.tasks = [];
            connection.emit('create_user', user);
            connection.on('create_user_response', function (response) {
                response.messages.should.deepEqual([{field: 'lastname',  message: 'wrong format'}]);
                done();
            });
        });
        it('Fail because user have tasks empty.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = null;
            connection.emit('create_user', user);
            connection.on('create_user_response', function (response) {
                response.messages.should.deepEqual([{field: 'tasks', message: 'must be array'}]);
                done();
            });
        });
        it('Fail because user have tasks wrong formated.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = 'eeeee';
            connection.emit('create_user', user);
            connection.on('create_user_response', function (response) {
                response.messages.should.deepEqual([{field: 'tasks', message: 'must be array'}]);
                done();
            });
        });
        it('Fail because user have wrong formated.', function(done){
            var user = {};
            user.email = 'john.doedomain.com';
            user.firstname = 'John Doe';
            user.lastname = 'Doe, John';
            user.tasks = 'eeeee';
            connection.emit('create_user', user);
            connection.on('create_user_response', function (response) {
                response.messages.should.deepEqual(
                    [
                        {field: 'email',  message: 'wrong format'},
                        {field: 'firstname',  message: 'wrong format'},
                        {field: 'lastname',  message: 'wrong format'},
                        {field: 'tasks', message: 'must be array'}
                    ]
                );
                done();
            });
        });
        it('Fail because user allready exists.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = [];
            let collection = db.collection('users');
            collection.insertOne(user, function(err, result) {
                assert.equal(null, err);
                connection.emit('create_user', user);
                connection.on('create_user_response', function (response) {
                    response.messages.should.deepEqual(
                        [
                            {field: 'all',  message: 'user already exists'}
                        ]
                    );
                    done();
                });
            });
        });
        it('Success.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = [];
            connection.emit('create_user', user);
            connection.on('create_user_response', function (response) {
                user._id =  null;
                response.messages.length.should.be.eql(0);
                response.user.should.deepEqual(user);
                done();
            });
        });
    });
    context('Find User', function () {
        var connection = null;
        var db = null;
        beforeEach(function(done) {
            var url = 'mongodb://localhost/stackrank';
            MongoClient.connect(url, function(err, result) {
                assert.equal(null, err);
                db = result;
                let socketURL = 'ws://localhost:8080';
                let options ={
                    transports: ['websocket'],
                    'force new connection': true
                };
                connection = io.connect(socketURL, options);
                connection.on('connect', function() {
                    done();
                });
            });
        });
        afterEach(function(done) {
            if (connection !== null) {
                let collection = db.collection('users');
                collection.deleteMany({});
                db.close();
                connection.disconnect();
            }
            connection = null;
            done();
        });
        it('Fail because email is empty.', function(done){
            connection.emit('find_user', null);
            connection.on('find_user_response', function (response) {
                response.message.should.deepEqual('email wrong format');
                done();
            });
        });
        it('Fail because email is wrong formated.', function(done){
            connection.emit('find_user', 'jondomain.com');
            connection.on('find_user_response', function (response) {
                response.message.should.deepEqual('email wrong format');
                done();
            });
        });
        it('Fail because user not found.', function(done){
            connection.emit('find_user', 'john.doe@domain.com');
            connection.on('find_user_response', function (response) {
                response.message.should.deepEqual('success');
                assert.equal(null, response.user);
                done();
            });
        });
        it('Success.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = [];
            var task1 = {};
            task1.tittle = 'first task';
            task1.status = 'new';
            task1.doDate = new Date().toString();
            task1.dateAdmission = new Date().toString();
            task1.urgency = 100;
            task1.importance = 10;
            var task2 = {};
            task2.tittle = 'second task';
            task2.status = 'new';
            task2.doDate = new Date().toString();
            task2.dateAdmission = new Date().toString();
            task2.urgency = 100;
            task2.importance = 0;
            user.tasks.push(task1);
            user.tasks.push(task2);

            let collection = db.collection('users');
            collection.insertOne(user, function(err, result) {
                assert.equal(null, err);
                connection.emit('find_user', 'john.doe@domain.com');
                connection.on('find_user_response', function (response) {
                    response.message.should.be.eql('success');
                    user._id = response.user._id;
                    user.tasks[0]._id = response.user.tasks[0]._id;
                    user.tasks[1]._id = response.user.tasks[1]._id;
                    response.user.should.deepEqual(user);
                    done();
                });
            });
        });
    });
    context('Remove User', function () {
        var connection = null;
        var db = null;
        beforeEach(function(done) {
            var url = 'mongodb://localhost/stackrank';
            MongoClient.connect(url, function(err, result) {
                assert.equal(null, err);
                db = result;
                let socketURL = 'ws://localhost:8080';
                let options ={
                    transports: ['websocket'],
                    'force new connection': true
                };
                connection = io.connect(socketURL, options);
                connection.on('connect', function() {
                    done();
                });
            });
        });
        afterEach(function(done) {
            if (connection !== null) {
                let collection = db.collection('users');
                collection.deleteMany({});
                db.close();
                connection.disconnect();
            }
            connection = null;
            done();
        });
        it('Fail because email is empty.', function(done){
            connection.emit('delete_user', null);
            connection.on('delete_user_response', function (response) {
                response.message.should.deepEqual('email wrong format');
                done();
            });
        });
        it('Fail because email is "".', function(done){
            connection.emit('delete_user', '');
            connection.on('delete_user_response', function (response) {
                response.message.should.deepEqual('email wrong format');
                done();
            });
        });
        it('Fail because email is wrong formated.', function(done){
            connection.emit('delete_user', 'johndoedomain.com');
            connection.on('delete_user_response', function (response) {
                response.message.should.deepEqual('email wrong format');
                done();
            });
        });
        it('Fail because users not found.', function(done){
            connection.emit('delete_user', 'john.doe@domain.com');
            connection.on('delete_user_response', function (response) {
                response.message.should.deepEqual('user not found');
                done();
            });
        });
        it('Success.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = [];
            var task1 = {};
            task1.tittle = 'first task';
            task1.status = 'new';
            task1.doDate = new Date().toString();
            task1.dateAdmission = new Date().toString();
            task1.urgency = 100;
            task1.importance = 10;
            var task2 = {};
            task2.tittle = 'second task';
            task2.status = 'new';
            task2.doDate = new Date().toString();
            task2.dateAdmission = new Date().toString();
            task2.urgency = 100;
            task2.importance = 0;
            user.tasks.push(task1);
            user.tasks.push(task2);

            let collection = db.collection('users');
            collection.insertOne(user, function(err, result) {
                assert.equal(null, err);
                connection.emit('delete_user', 'john.doe@domain.com');
                connection.on('delete_user_response', function (response) {
                    response.message.should.deepEqual('success');
                    connection.emit('find_user', 'john.doe@domain.com');
                    connection.on('find_user_response', function (response) {
                        response.message.should.be.eql('success');
                        assert.equal(null, response.user);
                        done();
                    });
                });
            });
        });
    });
    context('Update User', function () {
        var connection = null;
        var db = null;
        beforeEach(function(done) {
            var url = 'mongodb://localhost/stackrank';
            MongoClient.connect(url, function(err, result) {
                assert.equal(null, err);
                db = result;
                let socketURL = 'ws://localhost:8080';
                let options ={
                    transports: ['websocket'],
                    'force new connection': true
                };
                connection = io.connect(socketURL, options);
                connection.on('connect', function() {
                    done();
                });
            });
        });
        afterEach(function(done) {
            if (connection !== null) {
                let collection = db.collection('users');
                collection.deleteMany({});
                db.close();
                connection.disconnect();
            }
            connection = null;
            done();
        });
        it('Fail because user is empty.', function(done){
            connection.emit('update_user', null);
            connection.on('update_user_response', function (response) {
                response.messages.should.deepEqual([{field: 'all', message: 'user must be not empty'}]);
                done();
            });
        });
        it('Fail because user have email empty.', function(done){
            var user = {};
            user.email = '';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = [];
            connection.emit('update_user', user);
            connection.on('update_user_response', function (response) {
                response.messages.should.deepEqual([{field: 'email',  message: 'wrong format'}]);
                done();
            });
        });
        it('Fail because user have email wrong formated.', function(done){
            var user = {};
            user.email = 'john.doedomain.com';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = [];
            connection.emit('update_user', user);
            connection.on('update_user_response', function (response) {
                response.messages.should.deepEqual([{field: 'email',  message: 'wrong format'}]);
                done();
            });
        });
        it('Fail because user have firstname empty.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = '';
            user.lastname = 'Doe';
            user.tasks = [];
            connection.emit('update_user', user);
            connection.on('update_user_response', function (response) {
                response.messages.should.deepEqual([{field: 'firstname',  message: 'wrong format'}]);
                done();
            });
        });
        it('Fail because user have firstname wrong formated.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John Doe';
            user.lastname = 'Doe';
            user.tasks = [];
            connection.emit('update_user', user);
            connection.on('update_user_response', function (response) {
                response.messages.should.deepEqual([{field: 'firstname',  message: 'wrong format'}]);
                done();
            });
        });
        it('Fail because user have lastname empty.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = '';
            user.tasks = [];
            connection.emit('update_user', user);
            connection.on('update_user_response', function (response) {
                response.messages.should.deepEqual([{field: 'lastname',  message: 'wrong format'}]);
                done();
            });
        });
        it('Fail because user have lastname wrong formated.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = 'Doe, John';
            user.tasks = [];
            connection.emit('update_user', user);
            connection.on('update_user_response', function (response) {
                response.messages.should.deepEqual([{field: 'lastname',  message: 'wrong format'}]);
                done();
            });
        });
        it('Fail because user have tasks empty.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = null;
            connection.emit('update_user', user);
            connection.on('update_user_response', function (response) {
                response.messages.should.deepEqual([{field: 'tasks', message: 'must be array'}]);
                done();
            });
        });
        it('Fail because user have tasks wrong formated.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = 'eeeee';
            connection.emit('update_user', user);
            connection.on('update_user_response', function (response) {
                response.messages.should.deepEqual([{field: 'tasks', message: 'must be array'}]);
                done();
            });
        });
        it('Fail because user have wrong formated.', function(done){
            var user = {};
            user.email = 'john.doedomain.com';
            user.firstname = 'John Doe';
            user.lastname = 'Doe, John';
            user.tasks = 'eeeee';
            connection.emit('update_user', user);
            connection.on('update_user_response', function (response) {
                response.messages.should.deepEqual(
                    [
                        {field: 'email',  message: 'wrong format'},
                        {field: 'firstname',  message: 'wrong format'},
                        {field: 'lastname',  message: 'wrong format'},
                        {field: 'tasks', message: 'must be array'}
                    ]
                );
                done();
            });
        });
        it('Fail because users not found.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = [];
            connection.emit('update_user', user);
            connection.on('update_user_response', function (response) {
                response.message.should.deepEqual('user not found');
                done();
            });
        });
        it('Success.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = [];
            let collection = db.collection('users');
            collection.insertOne(user, function(err, result) {
                assert.equal(null, err);
                user.firstname = 'Jose';
                var task1 = {};
                task1.tittle = 'first task';
                task1.status = 'new';
                task1.doDate = new Date().toString();
                task1.dateAdmission = new Date().toString();
                task1.urgency = 5;
                task1.importance = 5;
                var task2 = {};
                task2.tittle = 'second task';
                task2.status = 'new';
                task2.doDate = new Date().toString();
                task2.dateAdmission = new Date().toString();
                task2.urgency = 5;
                task2.importance = 10;
                user.tasks.push(task1);
                user.tasks.push(task2);
                connection.emit('update_user', user);
                connection.on('update_user_response', function (response) {
                    response.messages.length.should.be.eql(0);
                    response.user.firstname.should.be.eql('Jose');
                    response.user.tasks.should.containDeepOrdered([task2, task1]);
                    done();
                });
            });
        });
    });
    context('Add Task', function () {
        var connection = null;
        var db = null;
        beforeEach(function(done) {
            var url = 'mongodb://localhost/stackrank';
            MongoClient.connect(url, function(err, result) {
                assert.equal(null, err);
                db = result;
                let socketURL = 'ws://localhost:8080';
                let options ={
                    transports: ['websocket'],
                    'force new connection': true
                };
                connection = io.connect(socketURL, options);
                connection.on('connect', function() {
                    done();
                });
            });
        });
        afterEach(function(done) {
            if (connection !== null) {
                let collection = db.collection('users');
                collection.deleteMany({});
                db.close();
                connection.disconnect();
            }
            connection = null;
            done();
        });
        it('Faild beacuse email is undefined.', function(done){
            var user = {};
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'email',message:'email wrong format'}]);
                done();
            });
        });
        it('Faild beacuse email is empty.', function(done){
            var user = {};
            user.email = '';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'email',message:'email wrong format'}]);
                done();
            });
        });
        it('Faild beacuse email is null.', function(done){
            var user = {};
            user.email = null;
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'email',message:'email wrong format'}]);
                done();
            });
        });
        it('Faild beacuse email is wrong format.', function(done){
            var user = {};
            user.email = 'johndowdomain.com';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'email',message:'email wrong format'}]);
                done();
            });
        });
        it('Faild beacuse task have urgency equal to null.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task.urgency = null;
            user.task.importance = 0;
            user.task.status = 'new';
            user.task.tittle = 'some tittle';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'urgency',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have urgency equal to undefined.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task.importance = 0;
            user.task.status = 'new';
            user.task.tittle = 'some tittle';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'urgency',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have urgency equal to aaaa.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task.urgency = 'aaaa';
            user.task.importance = 0;
            user.task.status = 'new';
            user.task.tittle = 'some tittle';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'urgency',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have urgency equal to 10.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task.urgency = 10;
            user.task.importance = 0;
            user.task.status = 'new';
            user.task.tittle = 'some tittle';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'urgency',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have urgency equal to 100.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task.urgency = 100;
            user.task.importance = 0;
            user.task.status = 'new';
            user.task.tittle = 'some tittle';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'urgency',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have importance equal to null.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task.urgency = 0;
            user.task.importance = null;
            user.task.status = 'new';
            user.task.tittle = 'some tittle';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'importance',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have importance equal to undefined.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task.urgency = 0;
            user.task.status = 'finish';
            user.task.tittle = 'some tittle';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'importance',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have importance equal to aaaa.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task.urgency = 0;
            user.task.importance = 'aaaa';
            user.task.status = 'in progress';
            user.task.tittle = 'some tittle';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'importance',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have importance equal to 10.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task.urgency = 0;
            user.task.importance = 100;
            user.task.status = 'new';
            user.task.tittle = 'some tittle';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'importance',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have importance equal to 100.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task.urgency = 0;
            user.task.importance = 100;
            user.task.status = 'new';
            user.task.tittle = 'some tittle';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'importance',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have status is equal undefined.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task.urgency = 0;
            user.task.importance = 9;
            user.task.tittle = 'some tittle';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'status',message:'must be new, in progress, block or finish'}]);
                done();
            });
        });
        it('Faild beacuse task have status is equal null.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task.urgency = 0;
            user.task.importance = 9;
            user.task.status = null;
            user.task.tittle = 'some tittle';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'status',message:'must be new, in progress, block or finish'}]);
                done();
            });
        });
        it('Faild beacuse task have status is equal empty.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task.urgency = 0;
            user.task.importance = 9;
            user.task.status = '';
            user.task.tittle = 'some tittle';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'status',message:'must be new, in progress, block or finish'}]);
                done();
            });
        });
        it('Faild beacuse task have status not equal "new","in progress","block" or "finish".', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task.urgency = 0;
            user.task.importance = 9;
            user.task.status = 'fruta';
            user.task.tittle = 'some tittle';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'status',message:'must be new, in progress, block or finish'}]);
                done();
            });
        });
        it('Faild beacuse task have tittle equal "".', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task.urgency = 0;
            user.task.importance = 9;
            user.task.status = 'in progress';
            user.task.tittle = '';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'tittle',message:'is requiered'}]);
                done();
            });
        });
        it('Faild beacuse task have tittle equal null.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task.urgency = 0;
            user.task.importance = 9;
            user.task.status = 'in progress';
            user.task.tittle = null;
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'tittle',message:'is requiered'}]);
                done();
            });
        });
        it('Faild beacuse task have tittle equal undefined.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task.urgency = 0;
            user.task.importance = 9;
            user.task.status = 'in progress';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'tittle',message:'is requiered'}]);
                done();
            });
        });
        it('Faild beacuse task have doDate less today.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task.urgency = 0;
            user.task.importance = 9;
            user.task.status = 'in progress';
            user.task.doDate = new Date(1983, 6, 14, 9, 0, 0);
            user.task.tittle = 'some tittle';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'doDate',message:'must be equal or bigger to the today'}]);
                done();
            });
        });
        it('Faild beacuse user not found.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task.urgency = 0;
            user.task.importance = 9;
            user.task.status = 'in progress';
            user.task.doDate = new Date(2017, 6, 14, 9, 0, 0);
            user.task.tittle = 'some tittle';
            connection.emit('add_task', user);
            connection.on('add_task_response', function (response) {
                response.messages.should.be.eql([{field:'all',message:'user not found'}]);
                done();
            });
        });
        it('Success.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = [];
            let collection = db.collection('users');
            collection.insertOne(user, function(err, result) {
                assert.equal(null, err);
                var user = {};
                user.email = 'john.doe@domain.com';
                user.task = {};
                user.task.urgency = 0;
                user.task.importance = 9;
                user.task.status = 'in progress';
                user.task.doDate = new Date(2017, 6, 14, 9, 0, 0);
                user.task.tittle = 'some tittle';
                connection.emit('add_task', user);
                connection.on('add_task_response', function (response) {
                    response.messages.length.should.be.eql(0);
                    response.user.tasks.length.should.be.eql(1);
                    response.user.tasks[0].tittle.should.be.eql(user.task.tittle);
                    response.user.tasks[0].urgency.should.be.eql(user.task.urgency);
                    response.user.tasks[0].importance.should.be.eql(user.task.importance);
                    response.user.tasks[0].status.should.be.eql(user.task.status);
                    done();
                });
            });
        });
    });
    context('Remove Task', function () {
        var connection = null;
        var db = null;
        beforeEach(function(done) {
            var url = 'mongodb://localhost/stackrank';
            MongoClient.connect(url, function(err, result) {
                assert.equal(null, err);
                db = result;
                let socketURL = 'ws://localhost:8080';
                let options ={
                    transports: ['websocket'],
                    'force new connection': true
                };
                connection = io.connect(socketURL, options);
                connection.on('connect', function() {
                    done();
                });
            });
        });
        afterEach(function(done) {
            if (connection !== null) {
                let collection = db.collection('users');
                collection.deleteMany({});
                db.close();
                connection.disconnect();
            }
            connection = null;
            done();
        });
        it('Faild beacuse email is undefined.', function(done){
            var user = {};
            connection.emit('remove_task', user);
            connection.on('remove_task_response', function (response) {
                response.messages.should.be.eql([{field:'email',message:'email wrong format'}]);
                done();
            });
        });
        it('Faild beacuse email is empty.', function(done){
            var user = {};
            user.email = '';
            connection.emit('remove_task', user);
            connection.on('remove_task_response', function (response) {
                response.messages.should.be.eql([{field:'email',message:'email wrong format'}]);
                done();
            });
        });
        it('Faild beacuse email is null.', function(done){
            var user = {};
            user.email = null;
            connection.emit('remove_task', user);
            connection.on('remove_task_response', function (response) {
                response.messages.should.be.eql([{field:'email',message:'email wrong format'}]);
                done();
            });
        });
        it('Faild beacuse email is wrong format.', function(done){
            var user = {};
            user.email = 'johndowdomain.com';
            connection.emit('remove_task', user);
            connection.on('remove_task_response', function (response) {
                response.messages.should.be.eql([{field:'email',message:'email wrong format'}]);
                done();
            });
        });
        it('Faild beacuse task _id is null.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = null;
            connection.emit('remove_task', user);
            connection.on('remove_task_response', function (response) {
                response.messages.should.be.eql([{field:'task._id',message:'is requiered'}]);
                done();
            });
        });
        it('Faild beacuse task _id is empty.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = '';
            connection.emit('remove_task', user);
            connection.on('remove_task_response', function (response) {
                response.messages.should.be.eql([{field:'task._id',message:'is requiered'}]);
                done();
            });
        });
        it('Faild beacuse task _id is undefined.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            connection.emit('remove_task', user);
            connection.on('remove_task_response', function (response) {
                response.messages.should.be.eql([{field:'task._id',message:'is requiered'}]);
                done();
            });
        });
        it('Faild beacuse user not found.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 0;
            connection.emit('remove_task', user);
            connection.on('remove_task_response', function (response) {
                response.messages.should.be.eql([{field:'all',message:'user not found'}]);
                done();
            });
        });
        it('Fail because task not exists.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = [];
            let collection = db.collection('users');
            collection.insertOne(user, function(err, result) {
                assert.equal(null, err);
                var user = {};
                user.email = 'john.doe@domain.com';
                user.task = {};
                user.task._id = 'ffffffffffff';
                connection.emit('remove_task', user);
                connection.on('remove_task_response', function (response) {
                    response.messages.should.deepEqual(
                        [
                            {field: 'all',  message: 'task not found'}
                        ]
                    );
                    done();
                });
            });
        });
        it('Fail because task not exists when with have another task.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = [];
            var task1 = {};
            task1.tittle = 'first task';
            task1.status = 'new';
            task1.doDate = new Date().toString();
            task1.dateAdmission = new Date().toString();
            task1.urgency = 100;
            task1.importance = 10;
            var task2 = {};
            task2.tittle = 'second task';
            task2.status = 'new';
            task2.doDate = new Date().toString();
            task2.dateAdmission = new Date().toString();
            task2.urgency = 100;
            task2.importance = 0;
            user.tasks.push(task1);
            user.tasks.push(task2);
            let collection = db.collection('users');
            collection.insertOne(user, function(err, result) {
                var user = {};
                user.email = 'john.doe@domain.com';
                user.task = {};
                user.task._id = 'ffffffffffff';
                connection.emit('remove_task', user);
                connection.on('remove_task_response', function (response) {
                    response.messages.should.deepEqual(
                        [
                            {field: 'all',  message: 'task not found'}
                        ]
                    );
                    done();
                });
            });
        });
        it('Success.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = [];
            var task1 = {};
            task1.tittle = 'first task';
            task1.status = 'new';
            task1.doDate = new Date().toString();
            task1.dateAdmission = new Date().toString();
            task1.urgency = 10;
            task1.importance = 10;
            var task2 = {};
            task2.tittle = 'second task';
            task2.status = 'new';
            task2.doDate = new Date().toString();
            task2.dateAdmission = new Date().toString();
            task2.urgency = 10;
            task2.importance = 0;
            var task3 = {};
            task3.tittle = 'third task';
            task3.status = 'new';
            task3.doDate = new Date().toString();
            task3.dateAdmission = new Date().toString();
            task3.urgency = 10;
            task3.importance = 5;
            user.tasks.push(task1);
            user.tasks.push(task2);
            user.tasks.push(task3);
            let collection = db.collection('users');
            collection.insertOne(user, function(err, result) {
                connection.emit('find_user', 'john.doe@domain.com');
                connection.on('find_user_response', function (response) {
                    response.message.should.be.eql('success');
                    var user = {};
                    user.email = 'john.doe@domain.com';
                    user.task = {};
                    user.task._id = response.user.tasks[0]._id;
                    task2._id = response.user.tasks[1]._id;
                    task3._id = response.user.tasks[2]._id;
                    connection.emit('remove_task', user);
                    connection.on('remove_task_response', function (response) {
                        response.messages.length.should.be.eql(0);
                        response.user.tasks.should.containDeepOrdered([task3, task2]);
                        done();
                    });
                });
            });
        });
    });
    context('Update Task', function () {
        var connection = null;
        var db = null;
        beforeEach(function(done) {
            var url = 'mongodb://localhost/stackrank';
            MongoClient.connect(url, function(err, result) {
                assert.equal(null, err);
                db = result;
                let socketURL = 'ws://localhost:8080';
                let options ={
                    transports: ['websocket'],
                    'force new connection': true
                };
                connection = io.connect(socketURL, options);
                connection.on('connect', function() {
                    done();
                });
            });
        });
        afterEach(function(done) {
            if (connection !== null) {
                let collection = db.collection('users');
                collection.deleteMany({});
                db.close();
                connection.disconnect();
            }
            connection = null;
            done();
        });
        it('Faild beacuse email is undefined.', function(done){
            var user = {};
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'email',message:'email wrong format'}]);
                done();
            });
        });
        it('Faild beacuse email is empty.', function(done){
            var user = {};
            user.email = '';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'email',message:'email wrong format'}]);
                done();
            });
        });
        it('Faild beacuse email is null.', function(done){
            var user = {};
            user.email = null;
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'email',message:'email wrong format'}]);
                done();
            });
        });
        it('Faild beacuse email is wrong format.', function(done){
            var user = {};
            user.email = 'johndowdomain.com';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'email',message:'email wrong format'}]);
                done();
            });
        });
        it('Faild beacuse task _id is null.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = null;
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'task._id',message:'is requiered'}]);
                done();
            });
        });
        it('Faild beacuse task _id is empty.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = '';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'task._id',message:'is requiered'}]);
                done();
            });
        });
        it('Faild beacuse task _id is undefined.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'task._id',message:'is requiered'}]);
                done();
            });
        });
        it('Faild beacuse task have urgency equal to null.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 'ffffffffffff';
            user.task.urgency = null;
            user.task.importance = 0;
            user.task.status = 'new';
            user.task.tittle = 'some tittle';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'urgency',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have urgency equal to undefined.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 'ffffffffffff';
            user.task.importance = 0;
            user.task.status = 'new';
            user.task.tittle = 'some tittle';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'urgency',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have urgency equal to aaaa.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 'ffffffffffff';
            user.task.urgency = 'aaaa';
            user.task.importance = 0;
            user.task.status = 'new';
            user.task.tittle = 'some tittle';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'urgency',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have urgency equal to 10.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 'ffffffffffff';
            user.task.urgency = 10;
            user.task.importance = 0;
            user.task.status = 'new';
            user.task.tittle = 'some tittle';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'urgency',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have urgency equal to 100.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 'ffffffffffff';
            user.task.urgency = 100;
            user.task.importance = 0;
            user.task.status = 'new';
            user.task.tittle = 'some tittle';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'urgency',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have importance equal to null.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 'ffffffffffff';
            user.task.urgency = 0;
            user.task.importance = null;
            user.task.status = 'new';
            user.task.tittle = 'some tittle';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'importance',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have importance equal to undefined.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 'ffffffffffff';
            user.task.urgency = 0;
            user.task.status = 'finish';
            user.task.tittle = 'some tittle';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'importance',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have importance equal to aaaa.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 'ffffffffffff';
            user.task.urgency = 0;
            user.task.importance = 'aaaa';
            user.task.status = 'in progress';
            user.task.tittle = 'some tittle';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'importance',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have importance equal to 10.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 'ffffffffffff';
            user.task.urgency = 0;
            user.task.importance = 100;
            user.task.status = 'new';
            user.task.tittle = 'some tittle';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'importance',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have importance equal to 100.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 'ffffffffffff';
            user.task.urgency = 0;
            user.task.importance = 100;
            user.task.status = 'new';
            user.task.tittle = 'some tittle';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'importance',message:'must be a number between [0 - 9]'}]);
                done();
            });
        });
        it('Faild beacuse task have status is equal undefined.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 'ffffffffffff';
            user.task.urgency = 0;
            user.task.importance = 9;
            user.task.tittle = 'some tittle';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'status',message:'must be new, in progress, block or finish'}]);
                done();
            });
        });
        it('Faild beacuse task have status is equal null.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 'ffffffffffff';
            user.task.urgency = 0;
            user.task.importance = 9;
            user.task.status = null;
            user.task.tittle = 'some tittle';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'status',message:'must be new, in progress, block or finish'}]);
                done();
            });
        });
        it('Faild beacuse task have status is equal empty.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 'ffffffffffff';
            user.task.urgency = 0;
            user.task.importance = 9;
            user.task.status = '';
            user.task.tittle = 'some tittle';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'status',message:'must be new, in progress, block or finish'}]);
                done();
            });
        });
        it('Faild beacuse task have status not equal "new","in progress","block" or "finish".', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 'ffffffffffff';
            user.task.urgency = 0;
            user.task.importance = 9;
            user.task.status = 'fruta';
            user.task.tittle = 'some tittle';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'status',message:'must be new, in progress, block or finish'}]);
                done();
            });
        });
        it('Faild beacuse task have tittle equal "".', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 'ffffffffffff';
            user.task.urgency = 0;
            user.task.importance = 9;
            user.task.status = 'in progress';
            user.task.tittle = '';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'tittle',message:'is requiered'}]);
                done();
            });
        });
        it('Faild beacuse task have tittle equal null.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 'ffffffffffff';
            user.task.urgency = 0;
            user.task.importance = 9;
            user.task.status = 'in progress';
            user.task.tittle = null;
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'tittle',message:'is requiered'}]);
                done();
            });
        });
        it('Faild beacuse task have tittle equal undefined.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 'ffffffffffff';
            user.task.urgency = 0;
            user.task.importance = 9;
            user.task.status = 'in progress';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'tittle',message:'is requiered'}]);
                done();
            });
        });
        it('Faild beacuse task have doDate less today.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 'ffffffffffff';
            user.task.urgency = 0;
            user.task.importance = 9;
            user.task.status = 'in progress';
            user.task.doDate = new Date(1983, 6, 14, 9, 0, 0);
            user.task.tittle = 'some tittle';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'doDate',message:'must be equal or bigger to the today'}]);
                done();
            });
        });
        it('Faild beacuse user not found.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.task = {};
            user.task._id = 0;
            user.task.urgency = 0;
            user.task.importance = 9;
            user.task.status = 'in progress';
            user.task.doDate = new Date(2017, 6, 14, 9, 0, 0);
            user.task.tittle = 'some tittle';
            connection.emit('update_task', user);
            connection.on('update_task_response', function (response) {
                response.messages.should.be.eql([{field:'all',message:'user not found'}]);
                done();
            });
        });
        it('Fail because task not exists.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = [];
            let collection = db.collection('users');
            collection.insertOne(user, function(err, result) {
                assert.equal(null, err);
                var user = {};
                user.email = 'john.doe@domain.com';
                user.task = {};
                user.task._id = 'ffffffffffff';
                user.task.urgency = 0;
                user.task.importance = 9;
                user.task.status = 'in progress';
                user.task.doDate = new Date(2017, 6, 14, 9, 0, 0);
                user.task.tittle = 'some tittle';
                connection.emit('update_task', user);
                connection.on('update_task_response', function (response) {
                    response.messages.should.deepEqual(
                        [
                            {field: 'all',  message: 'task not found'}
                        ]
                    );
                    done();
                });
            });
        });
        it('Fail because task not exists when with have another task.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = [];
            var task1 = {};
            task1.tittle = 'first task';
            task1.status = 'new';
            task1.doDate = new Date().toString();
            task1.dateAdmission = new Date().toString();
            task1.urgency = 100;
            task1.importance = 10;
            var task2 = {};
            task2.tittle = 'second task';
            task2.status = 'new';
            task2.doDate = new Date().toString();
            task2.dateAdmission = new Date().toString();
            task2.urgency = 100;
            task2.importance = 0;
            user.tasks.push(task1);
            user.tasks.push(task2);
            let collection = db.collection('users');
            collection.insertOne(user, function(err, result) {
                var user = {};
                user.email = 'john.doe@domain.com';
                user.task = {};
                user.task._id = 'ffffffffffff';
                user.task.urgency = 0;
                user.task.importance = 9;
                user.task.status = 'in progress';
                user.task.doDate = new Date(2017, 6, 14, 9, 0, 0);
                user.task.tittle = 'some tittle';
                connection.emit('update_task', user);
                connection.on('update_task_response', function (response) {
                    response.messages.should.deepEqual(
                        [
                            {field: 'all',  message: 'task not found'}
                        ]
                    );
                    done();
                });
            });
        });
        it('Success.', function(done){
            var user = {};
            user.email = 'john.doe@domain.com';
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.tasks = [];
            var task1 = {};
            task1.tittle = 'first task';
            task1.status = 'new';
            task1.doDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toString();
            task1.dateAdmission = new Date().toString();
            task1.urgency = 10;
            task1.importance = 10;
            var task2 = {};
            task2.tittle = 'second task';
            task2.status = 'new';
            task2.doDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toString();
            task2.dateAdmission = new Date().toString();
            task2.urgency = 10;
            task2.importance = 0;
            user.tasks.push(task1);
            user.tasks.push(task2);
            let collection = db.collection('users');
            collection.insertOne(user, function(err, result) {
                connection.emit('find_user', 'john.doe@domain.com');
                connection.on('find_user_response', function (response) {
                    response.message.should.be.eql('success');
                    var user = {};
                    user.email = 'john.doe@domain.com';
                    user.task = {};
                    user.task._id = response.user.tasks[0]._id;
                    user.task.tittle = response.user.tasks[0].tittle;
                    user.task.status = response.user.tasks[0].status;
                    user.task.doDate = response.user.tasks[0].doDate;
                    user.task.dateAdmission = response.user.tasks[0].dateAdmission;
                    user.task.urgency = 9;
                    user.task.importance = 0;
                    connection.emit('update_task', user);
                    connection.on('update_task_response', function (response) {
                        response.messages.length.should.be.eql(0);
                        response.user.tasks.should.containDeepOrdered([task2, user.task]);
                        done();
                    });
                });
            });
        });
    });
});
