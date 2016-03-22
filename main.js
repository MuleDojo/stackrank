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
 * @category   Main
 * @package    main
 * @author     Ignacio R. Galieri <irgalieri@gmail.com>
 * @copyright  2016 Mule Dojo
 * @license    GPL-3.0
 * @link       https://github.com/MuleDojo/stackrank
 */
"use strict";

console.info("Stack Rank WebSocket Server");
console.info("Copyright (C) 2016 Mule Dojo");

var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var Users = require('./src/collections/users.js');
var User = require('./src/models/user.js');
var Task = require('./src/models/task.js');

var serverPort = 8080;
var urlMongo = 'mongodb://localhost/stackrank';
var emailCheck = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var wordCheck = /^\w+$/;
var num09Check = /^[0-9]{1}$/;

app.use('/', function(req, res) {
     res.send('Stack Rank');
});

/**
 * validateUser
 *
 * Validate user fields
 *
 * @param  {Object} user User Object to Validate
 *
 * @return {Object}
 */
function validateUser(user) {
    var response = {};
    response.messages = [];
    if (user === null) {
        response.messages.push({field: 'all', message: 'user must be not empty'});
        return response
    }
    if (!emailCheck.test(user.email)) {
        response.messages.push({field: 'email', message: 'wrong format'});
    }
    if (!wordCheck.test(user.firstname)) {
        response.messages.push({field: 'firstname', message: 'wrong format'});
    }
    if (!wordCheck.test(user.lastname)) {
        response.messages.push({field: 'lastname', message: 'wrong format'});
    }
    if (!Array.isArray(user.tasks)) {
        response.messages.push({field: 'tasks', message: 'must be array'});
    }
    return response;
}

/**
 * createUser
 *
 * Creatre user from user object
 *
 * @param  {Object} request User Object to Validate
 *
 * @return {User}
 */
function createUser(request) {
    var user = new User;
    user.firstname = request.firstname;
    user.lastname = request.lastname;
    user.email = request.email;
    for (let index in request.tasks) {
        let elem = request.tasks[index];
        let task = new Task;
        task.tittle = elem.tittle;
        task.status = elem.status;
        task.doDate = elem.doDate;
        task.dateAdmission = elem.dateAdmission;
        task.urgency = elem.urgency;
        task.importance = elem.importance;
        user.addTask(task);
    }
    return user;
}

var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(socket){
    console.log((new Date()) + ' Connection accepted.');
    socket.on('create_user', function (request) {
        var response = validateUser(request);
        if (response.messages.length !== 0) {
            return socket.emit('create_user_response', response);
        }
        var db = null;
        MongoClient.connect(urlMongo, function(error, result) {
            if (error) {
                response.messages.push({field: 'all', message: error.message});
                return socket.emit('create_user_response', response);
            }
            db = result;

            var users = new Users;
            users.connection = db;

            users.findUser(request.email, function (error, message, result) {
                if (!error) {
                    if (result instanceof User) {
                        response.messages.push({field: 'all', message: 'user already exists'});
                        db.close();
                        return socket.emit('create_user_response', response);
                    }
                }
                var user = createUser(request);
                users.insertUser(user, function (error, message) {
                    if (error) {
                        response.messages.push({field: 'all', message: message});
                    }

                    response.user = user;

                    db.close();
                    return socket.emit('create_user_response', response);
                });
            });
        });
    });
    socket.on('find_user', function (request) {
        var response = {};
        if (!emailCheck.test(request)) {
            response.message = 'email wrong format';
            return socket.emit('find_user_response', response);
        }
        var db = null;
        MongoClient.connect(urlMongo, function(error, result) {
            if (error) {
                response.message = error.message;
                return socket.emit('find_user_response', response);
            }
            db = result;
            var users = new Users;
            users.connection = db;
            users.findUser(request, function (error, message, result) {
                if (error) {
                    response.message = error.message;
                    db.close();
                    return socket.emit('find_user_response', response);
                }
                response.message = 'success';
                response.user = result;
                db.close();
                return socket.emit('find_user_response', response);
            });
        });
    });
    socket.on('delete_user', function (request) {
        var response = {};
        if (!emailCheck.test(request)) {
            response.message = 'email wrong format';
            return socket.emit('delete_user_response', response);
        }
        var db = null;
        MongoClient.connect(urlMongo, function(error, result) {
            if (error) {
                response.message = error.message;
                return socket.emit('delete_user_response', response);
            }
            db = result;
            var users = new Users;
            users.connection = db;
            users.findUser(request, function (error, message, result) {
                if (error) {
                    response.message = error.message;
                    db.close();
                    return socket.emit('delete_user_response', response);
                }
                if (result === null) {
                    response.message = 'user not found';
                    db.close();
                    return socket.emit('delete_user_response', response);
                }
                users.removeUser(result, function (error, message) {
                    if (error) {
                        response.message = error.message;
                        db.close();
                        return socket.emit('delete_user_response', response);
                    }
                    response.message = 'success';
                    db.close();
                    return socket.emit('delete_user_response', response);
                });
            });
        });
    });
    socket.on('update_user', function (request) {
        var response = validateUser(request);
        if (response.messages.length !== 0) {
            return socket.emit('update_user_response', response);
        }
        var db = null;
        MongoClient.connect(urlMongo, function(error, result) {
            if (error) {
                response.message = error.message;
                return socket.emit('update_user_response', response);
            }
            db = result;
            var users = new Users;
            users.connection = db;
            users.findUser(request.email, function (error, message, result) {
                if (error) {
                    response.message = error.message;
                    db.close();
                    return socket.emit('update_user_response', response);
                }
                if (result === null) {
                    response.message = 'user not found';
                    db.close();
                    return socket.emit('update_user_response', response);
                }
                var user = createUser(request);
                user.sortTasks(function (error) {
                    users.updateUser(user, function (error, message) {
                        if (error) {
                            response.messages.push({field: 'all', message: message});
                        }
                        response.user = user;
                        db.close();
                        return socket.emit('update_user_response', response);
                    });
                });
            });
        });
    });
    socket.on('add_task', function (request) {
        var response = {};
        response.messages = [];
        if (!emailCheck.test(request.email)) {
            response.messages.push({field:'email',message:'email wrong format'});
            return socket.emit('add_task_response', response);
        }
        if (!num09Check.test(request.task.urgency)) {
            response.messages.push({field: 'urgency', message: 'must be a number between [0 - 9]'});
        }
        if (!num09Check.test(request.task.importance)) {
            response.messages.push({field: 'importance', message: 'must be a number between [0 - 9]'});
        }
        var statusCheck = /^(new|in progress|block|finish)$/;
        if (!statusCheck.test(request.task.status)) {
            response.messages.push({field:'status',message:'must be new, in progress, block or finish'});
        }
        if ((request.task.tittle === '') || (request.task.tittle === undefined) || (request.task.tittle === null)) {
            response.messages.push({field:'tittle',message:'is requiered'});
        }
        if (new Date(request.task.doDate) < new Date()) {
            response.messages.push({field:'doDate',message:'must be equal or bigger to the today'});
        }
        if (response.messages.length !== 0) {
            return socket.emit('add_task_response', response);
        }
        var db = null;
        MongoClient.connect(urlMongo, function(error, result) {
            if (error) {
                response.messages.push({field:'all',message:error.message});
                return socket.emit('add_task_response', response);
            }
            db = result;
            var users = new Users;
            users.connection = db;
            users.findUser(request.email, function (error, message, result) {
                if (error) {
                    response.messages.push({field:'all',message:error.message});
                    db.close();
                    return socket.emit('add_task_response', response);
                }
                if (result === null) {
                    response.messages.push({field:'all',message:'user not found'});
                    db.close();
                    return socket.emit('add_task_response', response);
                }
                let task = new Task;
                task.tittle = request.task.tittle;
                task.status = request.task.status;
                task.doDate = request.task.doDate;
                task.urgency = request.task.urgency;
                task.importance = request.task.importance;
                result.addTask(task);
                result.sortTasks(function (error) {
                    users.updateUser(result, function (error, message) {
                        if (error) {
                            response.messages.push({field: 'all', message: message});
                        }
                        response.user = result;
                        db.close();
                        return socket.emit('add_task_response', response);
                    });
                });
            });
        });
    });
    socket.on('remove_task', function (request) {
        var response = {};
        response.messages = [];
        if (!emailCheck.test(request.email)) {
            response.messages.push({field:'email',message:'email wrong format'});
            return socket.emit('remove_task_response', response);
        }
        if ((request.task == undefined) || (request.task._id === '') || (request.task._id === undefined) || (request.task._id === null)) {
            response.messages.push({field:'task._id',message:'is requiered'});
            return socket.emit('remove_task_response', response);
        }
        var db = null;
        MongoClient.connect(urlMongo, function(error, result) {
            if (error) {
                response.messages.push({field:'all',message:error.message});
                return socket.emit('remove_task_response', response);
            }
            db = result;
            var users = new Users;
            users.connection = db;
            users.findUser(request.email, function (error, message, result) {
                if (error) {
                    response.messages.push({field:'all',message:error.message});
                    db.close();
                    return socket.emit('remove_task_response', response);
                }
                if (result === null) {
                    response.messages.push({field:'all',message:'user not found'});
                    db.close();
                    return socket.emit('remove_task_response', response);
                }
                if (result.tasks.length == 0) {
                    response.messages.push({field:'all',message:'task not found'});
                    db.close();
                    return socket.emit('remove_task_response', response);
                }
                var i = -1;
                for (let index in result.tasks) {
                    if (result.tasks[index]._id == request.task._id) {
                        i = index;
                        break;
                    }
                }
                if (i === -1) {
                    response.messages.push({field:'all',message:'task not found'});
                    db.close();
                    return socket.emit('remove_task_response', response);
                }
                var user = result;
                user.tasks.splice(i, 1);
                user.sortTasks(function (error) {
                    users.updateUser(user, function (error, message) {
                        if (error) {
                            response.messages.push({field: 'all', message: message});
                        }
                        response.user = user;
                        db.close();
                        return socket.emit('remove_task_response', response);
                    });
                });
            });
        });
    });
    socket.on('update_task', function (request) {
        var response = {};
        response.messages = [];
        if (!emailCheck.test(request.email)) {
            response.messages.push({field:'email',message:'email wrong format'});
            return socket.emit('update_task_response', response);
        }
        if ((request.task == undefined) || (request.task._id === '') || (request.task._id === undefined) || (request.task._id === null)) {
            response.messages.push({field:'task._id',message:'is requiered'});
            return socket.emit('update_task_response', response);
        }
        if (!num09Check.test(request.task.urgency)) {
            response.messages.push({field: 'urgency', message: 'must be a number between [0 - 9]'});
        }
        if (!num09Check.test(request.task.importance)) {
            response.messages.push({field: 'importance', message: 'must be a number between [0 - 9]'});
        }
        var statusCheck = /^(new|in progress|block|finish)$/;
        if (!statusCheck.test(request.task.status)) {
            response.messages.push({field:'status',message:'must be new, in progress, block or finish'});
        }
        if ((request.task.tittle === '') || (request.task.tittle === undefined) || (request.task.tittle === null)) {
            response.messages.push({field:'tittle',message:'is requiered'});
        }
        if (new Date(request.task.doDate) < new Date()) {
            response.messages.push({field:'doDate',message:'must be equal or bigger to the today'});
        }
        if (response.messages.length !== 0) {
            return socket.emit('update_task_response', response);
        }
        var db = null;
        MongoClient.connect(urlMongo, function(error, result) {
            if (error) {
                response.messages.push({field:'all',message:error.message});
                return socket.emit('update_task_response', response);
            }
            db = result;
            var users = new Users;
            users.connection = db;
            users.findUser(request.email, function (error, message, result) {
                if (error) {
                    response.messages.push({field:'all',message:error.message});
                    db.close();
                    return socket.emit('update_task_response', response);
                }
                if (result === null) {
                    response.messages.push({field:'all',message:'user not found'});
                    db.close();
                    return socket.emit('update_task_response', response);
                }
                if (result.tasks.length == 0) {
                    response.messages.push({field:'all',message:'task not found'});
                    db.close();
                    return socket.emit('update_task_response', response);
                }
                var i = -1;
                for (let index in result.tasks) {
                    if (result.tasks[index]._id == request.task._id) {
                        i = index;
                        break;
                    }
                }
                if (i === -1) {
                    response.messages.push({field:'all',message:'task not found'});
                    db.close();
                    return socket.emit('update_task_response', response);
                }
            });
        });
    });
    socket.on('disconnect', function(data){
        console.log((new Date()) + ' Connection finish.');
    });
});
server.listen(serverPort);
console.log((new Date()) + ' Listen ' + serverPort);
