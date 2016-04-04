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
 * @package    components
 * @author     Ignacio R. Galieri <irgalieri@gmail.com>
 * @copyright  2016 Mule Dojo
 * @license    GPL-3.0
 * @link       https://github.com/MuleDojo/stackrank
 */
var React = require('react');
var Table = React.createClass({
    render: function(){
        return (
<table className="table">
    <thead>
        <tr>
            <th>#</th>
            {(function (self) {
                if (self.props.columns !== undefined) {
                    var count = 0;
                    return self.props.columns.map(function (obj) {
                        count++;
                        return <th key={'col' + count}>{obj}</th>;
                    })
                }
            })(this)}
        </tr>
    </thead>
    <tbody>
        {(function(self) {
            if (self.props.rows !== undefined) {
                var count = 0;
                return self.props.rows.map(function (obj) {
                    count++;
                    return <tr key={'row' + count}>{obj}>
                                <th scope="row">{obj.id}</th>
                           </tr>;
                })
            }
        })(this)}
    </tbody>
</table>
        );
    }
});
module.exports = Table;
