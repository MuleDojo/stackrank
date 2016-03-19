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
            taskOther._id = 1;
            taskOther.dateAdmission = task.dateAdmission;
            taskOther.doDate = task.doDate;

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
            taskOther._id = 2;
            taskOther.dateAdmission = task2.dateAdmission;
            taskOther.doDate = task2.doDate;

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
            taskOther._id = 3;
            taskOther.dateAdmission = task3.dateAdmission;
            taskOther.doDate = task3.doDate;

            obj.tasks.should.containDeep([taskOther]);
            done();
        });
    });
    // context('User#deleteTask', function () {
    //     it('Delete Task X.', function(done){
    //         let obj = new User;
    //         let task = new Task;
    //         obj.addTask(task);
    //
    //         let taskOther = new Task;
    //         taskOther._id = 1;
    //
    //         obj.deleteTask(taskOther);
    //
    //         obj.tasks.should.not.containDeep([taskOther]);
    //         done();
    //     });
    // });
});
