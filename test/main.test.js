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
                response.messages.should.deepEqual({message: 'email wrong format'});
                done();
            });
        });
        it('Fail because email is wrong formated.', function(done){
            connection.emit('find_user', 'jondomain.com');
            connection.on('find_user_response', function (response) {
                response.messages.should.deepEqual({message: 'email wrong format'});
                done();
            });
        });
        it('Fail because user not found.', function(done){
            connection.emit('find_user', 'john.doe@domain.com');
            connection.on('find_user_response', function (response) {
                response.messages.should.deepEqual({message: 'success'});
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
                    response.messages.should.be.eql({message: 'success'});
                    user._id = response.user._id;
                    user.tasks[0]._id = response.user.tasks[0]._id;
                    user.tasks[1]._id = response.user.tasks[1]._id;
                    response.user.should.deepEqual(user);
                    done();
                });
            });
        });
    });
});
