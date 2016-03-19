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
var Task = require(rootPath+'src/models/task.js');

describe('Task', function() {
    context('Create Task', function () {
        it('Exits the Model Task.', function(done){
            let obj = new Task;
            obj.should.be.instanceof(Task, 'The Class Tack No Exist');
            done();
        });
        it('Have property urgency.', function(done){
            let obj = new Task;
            obj.should.have.properties('urgency');
            done();
        });
        it('Have property importance.', function(done){
            let obj = new Task;
            obj.should.have.properties('importance');
            done();
        });
        it('Have property tittle.', function(done){
            let obj = new Task;
            obj.should.have.properties('tittle');
            done();
        });
        it('Have property dateAdmission.', function(done){
            let obj = new Task;
            obj.should.have.properties('dateAdmission');
            done();
        });
        it('Have property doDate.', function(done){
            let obj = new Task;
            obj.should.have.properties('doDate');
            done();
        });
        it('Have property status.', function(done){
            let obj = new Task;
            obj.should.have.properties('status');
            done();
        });
        it('Have property _id.', function(done){
            let obj = new Task;
            obj.should.have.properties('_id');
            done();
        });
    });
});
