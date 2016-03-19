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
 * @package    models
 * @author     Ignacio R. Galieri <irgalieri@gmail.com>
 * @copyright  2016 Mule Dojo
 * @license    GPL-3.0
 * @link       https://github.com/MuleDojo/stackrank
 */
"use strict";

var crypto = require('crypto');

class User {
    /**
     * Constructor
     *
     * @constructor
     * @api public
     */
    constructor () {
        this.firstname = '';
        this.lastname = '';
        this.email = '';
        this.tasks = [];
        this._id = null;
    }
    /**
     * addTask
     *
     * Add a New Task.
     *
     * @param {Task} task A new Task
     *
     * @return void
     * @api public
     */
    addTask(task) {
        task._id = crypto.createHash('md5').update(JSON.stringify(task)).digest("hex");
        this.tasks.push(task);
    }
    /**
     * deleteTask
     *
     * Delete a Task.
     *
     * @param {Task} task Task for delete
     *
     * @return void
     * @api public
     */
    deleteTask(task) {
        let index = this.tasks.findIndex(function (obj) {
            return obj._id == task._id;
        });

        if (index > -1) {
            this.tasks.splice(index, 1);
        }
    }
    /**
     * sortTasks
     *
     * Order task by urgency, importance and dateAdmission
     *
     * @param  {Function} callback Callback
     *
     * @return void
     * @api public
     */
    sortTasks(callback) {
        var orderByProperty = function orderByProperty(prop) {
            var args = Array.prototype.slice.call(arguments, 1);
            return function (b, a) {
                var value1 = a[prop];
                if (a[prop] instanceof Date) {
                    value1 = a[prop].getTime();
                }
                var value2 = b[prop];
                if (b[prop] instanceof Date) {
                    value2 = b[prop].getTime();
                }

                var equality = value1 - value2;
                if (equality === 0 && arguments.length > 1) {
                    return orderByProperty.apply(null, args)(b, a);
                }
                return equality;
            };
        };

        this.tasks.sort(orderByProperty('urgency', 'importance', 'dateAdmission'));

        callback(false);
    }
}

module.exports = User;
