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

// Version 1
// - debe ser una lista ordenada (urgencia-importancia-fecha ingreso, en ese orden), que contenga los campos urgencia, importancia, titulo fecha de ingreso, fecha estimada de finalizacion.
// - al agregarse una nueva tarea, debe reorganizarse automaticamente y reordenar las demas
// - todos los campos de la lista deben ser editables inline
// - los items de la lista, deben poder marcarse como finalizados
// - deben poder ver,ocultar??  los items ya marcados como finalizados

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
                connection.close();
            }
            done();
        });
        it('Create New User - Faild because connection is NULL.', function(done){
            let obj = new Users;
            obj.connection = null;
            let user = "John Doe";
            obj.insertUser(user, function(error, message) {
                error.should.be.eql(true);
                message.should.be.eql("You must set connection first");
                done();
            });
        });
        it('Create New User - Faild because Obj is "John Doe".', function(done){
            let obj = new Users;
            obj.connection = connection;
            let user = "John Doe";
            obj.insertUser(user, function(error, message) {
                error.should.be.eql(true);
                message.should.be.eql("user must be instance of User class");
                done();
            });
        });
        it('Create New User - Faild because Obj is 100.', function(done){
            let obj = new Users;
            obj.connection = connection;
            let user = 100;
            obj.insertUser(user, function(error, message) {
                error.should.be.eql(true);
                message.should.be.eql("user must be instance of User class");
                done();
            });
        });
        it('Create New User - Faild because Obj is null.', function(done){
            let obj = new Users;
            obj.connection = connection;
            let user = null;
            obj.insertUser(user, function(error, message) {
                error.should.be.eql(true);
                message.should.be.eql("user must be instance of User class");
                done();
            });
        });
        it('Create New User - Faild because Obj no is instance of User.', function(done){
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
                    collection.removeMany();
                    collection.find().toArray(function(err, docs) {
                      assert.equal(null, err);
                      docs.length.should.be.eql(0);
                      done();
                    });
                });
            });
        });
    });
});
