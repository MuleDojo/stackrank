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
 * @category   View
 * @package    views
 * @author     Ignacio R. Galieri <irgalieri@gmail.com>
 * @copyright  2016 Mule Dojo
 * @license    GPL-3.0
 * @link       https://github.com/MuleDojo/stackrank
 */

var React = require('react');
var ReactDOM = require('react-dom');
var Header = require('./components/header.js');
var Table = require('./components/table.js');

ReactDOM.render(
    <div>
        <Header title="Tasks Rank"/>
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2"/>
                <div className="col-md-8">
                    <Table columns={['Urgency', 'Importance', 'Title', 'Addmission', 'Do', 'Actions']}/>
                </div>
                <div className="col-md-2"/>
            </div>
        </div>
    </div>,
    document.getElementById('wrapper')
);
