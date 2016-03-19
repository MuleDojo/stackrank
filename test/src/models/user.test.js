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
var crypto = require('crypto');

describe('User', function() {
    context('Create User', function () {
        it('Exits the Model User.', function(done){
            let obj = new User;
            obj.should.be.instanceof(User, 'The Class User No Exist');
            done();
        });
        it('Have property firstname.', function(done){
            let obj = new User;
            obj.should.have.properties('firstname');
            done();
        });
        it('Have property lastname.', function(done){
            let obj = new User;
            obj.should.have.properties('lastname');
            done();
        });
        it('Have property email.', function(done){
            let obj = new User;
            obj.should.have.properties('email');
            done();
        });
        it('Have property tasks.', function(done){
            let obj = new User;
            obj.should.have.properties('tasks');
            done();
        });
        it('Have property _id.', function(done){
            let obj = new User;
            obj.should.have.properties('_id');
            done();
        });
    });
    context('User#addTask', function () {
        it('Add new Task.', function(done){
            let obj = new User;
            let task = new Task;
            obj.addTask(task);

            let taskOther = new Task;
            taskOther.dateAdmission = task.dateAdmission;
            taskOther.doDate = task.doDate;
            taskOther._id = crypto.createHash('md5').update(JSON.stringify(taskOther)).digest("hex");

            obj.tasks.should.containDeep([taskOther]);
            done();
        });
        it('Add second new Task.', function(done){
            let obj = new User;
            let task1 = new Task;
            obj.addTask(task1);
            let task2 = new Task;
            task2.tittle = 'second task';
            obj.addTask(task2);

            let taskOther = new Task;
            taskOther.tittle = 'second task';
            taskOther.dateAdmission = task2.dateAdmission;
            taskOther.doDate = task2.doDate;
            taskOther._id = crypto.createHash('md5').update(JSON.stringify(taskOther)).digest("hex");

            obj.tasks.should.containDeep([taskOther]);
            done();
        });
        it('Add third new Task.', function(done){
            let obj = new User;
            let task1 = new Task;
            obj.addTask(task1);
            let task2 = new Task;
            task2.tittle = 'second task';
            obj.addTask(task2);
            let task3 = new Task;
            task3.tittle = 'third task';
            obj.addTask(task3);

            let taskOther = new Task;
            taskOther.tittle = 'third task';
            taskOther.dateAdmission = task3.dateAdmission;
            taskOther.doDate = task3.doDate;
            taskOther._id = crypto.createHash('md5').update(JSON.stringify(taskOther)).digest("hex");

            obj.tasks.should.containDeep([taskOther]);
            done();
        });
    });
    context('User#deleteTask', function () {
        it('Delete First Task.', function(done){
            let obj = new User;
            let task = new Task;
            obj.addTask(task);

            let taskOther = new Task;
            taskOther.dateAdmission = task.dateAdmission;
            taskOther.doDate = task.doDate;
            taskOther._id = crypto.createHash('md5').update(JSON.stringify(taskOther)).digest("hex");

            obj.deleteTask(taskOther);

            obj.tasks.should.not.containDeep([taskOther]);
            done();
        });
        it('Delete Second Task.', function(done){
            let obj = new User;
            let task = new Task;
            task.title = 'Second Task';
            let task1 = new Task;
            obj.addTask(task);
            obj.addTask(task1);

            let taskOther = new Task;
            taskOther.title = 'Second Task';
            taskOther.dateAdmission = task.dateAdmission;
            taskOther.doDate = task.doDate;
            taskOther._id = crypto.createHash('md5').update(JSON.stringify(taskOther)).digest("hex");

            obj.deleteTask(taskOther);

            obj.tasks.should.not.containDeep([taskOther]);
            done();
        });
        it('Delete and Insert Task.', function(done){
            let obj = new User;
            let task = new Task;
            let task1 = new Task;
            obj.addTask(task);

            let taskOther = new Task;
            taskOther.dateAdmission = task.dateAdmission;
            taskOther.doDate = task.doDate;
            taskOther._id = crypto.createHash('md5').update(JSON.stringify(taskOther)).digest("hex");


            obj.deleteTask(taskOther);
            obj.tasks.should.not.containDeep([taskOther]);

            obj.addTask(task1);

            obj.tasks.should.containDeep([task1]);
            done();
        });
        it('Delete Not exits Task.', function(done){
            let obj = new User;
            let task = new Task;
            let task1 = new Task;
            task1.title = 'Second Task';
            obj.addTask(task);

            let taskOther = new Task;
            taskOther.dateAdmission = task1.dateAdmission;
            taskOther.doDate = task1.doDate;
            taskOther.title = 'Second Task';
            taskOther._id = crypto.createHash('md5').update(JSON.stringify(taskOther)).digest("hex");

            obj.deleteTask(taskOther);
            obj.tasks.should.not.containDeep([taskOther]);
            obj.tasks.should.containDeep([task]);
            done();
        });
    });
    context('User#sortTasks', function () {
        it('sort by urgency.', function(done){
            var obj = new User;
            var task = new Task;
            var task1 = new Task;
            var task2 = new Task;
            var task3 = new Task;
            task2.urgency = 0;
            task.urgency = 1;
            task1.urgency = 3;
            obj.addTask(task2);
            obj.addTask(task1);
            obj.addTask(task);

            obj.sortTasks(function (err) {
                if (!err) {
                    obj.tasks.should.containDeepOrdered([task1, task, task2]);
                    done();
                }
            })
        });
        it('sort by importance.', function(done){
            var obj1 = new User;
            var task = new Task;
            var task1 = new Task;
            var task2 = new Task;
            var task3 = new Task;
            task2.urgency = 0;
            task.urgency = 0;
            task1.urgency = 0;
            task2.importance = 0;
            task.importance = 5;
            task1.importance = 1;
            obj1.addTask(task2);
            obj1.addTask(task1);
            obj1.addTask(task);

            obj1.sortTasks(function (err) {
                if (!err) {
                    obj1.tasks.should.containDeepOrdered([task, task1, task2]);
                    done();
                }
            })
        });
        it('sort by dateAdmission.', function(done){
            var obj2 = new User;
            var task = new Task;
            var task1 = new Task;
            var task2 = new Task;
            var task3 = new Task;


            task2.urgency = 0;
            task2.importance = 0;
            task2.dateAdmission = new Date(2016, 6, 15, 23, 59, 10);

            task3.urgency = 0;
            task3.importance = 0;
            task3.dateAdmission = new Date(2016, 6, 14, 23, 59, 30);

            task1.urgency = 0;
            task1.importance = 0;
            task1.dateAdmission = new Date(2016, 6, 14, 23, 59, 11);

            task.urgency = 0;
            task.importance = 0;
            task.dateAdmission = new Date(2016, 6, 14, 23, 59, 0);

            obj2.addTask(task3);
            obj2.addTask(task2);
            obj2.addTask(task1);
            obj2.addTask(task);

            obj2.sortTasks(function (err) {
                if (!err) {
                    obj2.tasks.should.containDeepOrdered([task2, task3, task1, task]);
                    done();
                }
            })
        });
        it('sort by urgency and importance.', function(done){
            var obj3 = new User;
            var task = new Task;
            var task1 = new Task;
            var task2 = new Task;
            var task3 = new Task;
            task2.urgency = 0;
            task.urgency = 0;
            task1.urgency = 3;
            task2.importance = 0;
            task.importance = 10;
            task1.importance = 1;
            obj3.addTask(task2);
            obj3.addTask(task1);
            obj3.addTask(task);

            obj3.sortTasks(function (err) {
                if (!err) {
                    obj3.tasks.should.containDeepOrdered([task1, task, task2]);
                    done();
                }
            })
        });
        it('sort by urgency and importance and dateAdmission.', function(done){
            var obj4 = new User;
            var task = new Task;
            var task1 = new Task;
            var task2 = new Task;
            var task3 = new Task;

            task.urgency = 3;
            task.importance = 1;
            task.dateAdmission = new Date(2016, 6, 14, 23, 59, 0);

            task3.urgency = 3;
            task3.importance = 0;
            task3.dateAdmission = new Date(2016, 6, 14, 23, 59, 30);

            task1.urgency = 0;
            task1.importance = 10;
            task1.dateAdmission = new Date(2016, 6, 14, 23, 59, 11);

            task2.urgency = 0;
            task2.importance = 0;
            task2.dateAdmission = new Date(2016, 6, 14, 23, 59, 10);


            obj4.addTask(task);
            obj4.addTask(task2);
            obj4.addTask(task1);
            obj4.addTask(task3);

            obj4.sortTasks(function (err) {
                if (!err) {
                    obj4.tasks.should.containDeepOrdered([task, task3, task1, task2]);
                    done();
                }
            })
        });
    });
});
