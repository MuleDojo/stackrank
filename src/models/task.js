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

class Tack {
    /**
     * Constructor
     *
     * @constructor
     * @api public
     */
    constructor () {
        this._id = null;
        this.urgency = 0;
        this.importance = 0;
        this.tittle = 'New Task';
        this.dateAdmission = new Date();
        this.doDate = new Date();
        this.status = 'new';
    }
}

module.exports = Tack;
