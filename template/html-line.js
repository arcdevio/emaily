'use strict';

module.exports = function (name, value) {
    name = name.replace(/([A-Z])/g, ' $1').toLowerCase();
    return /*html*/`
		<tr>
			<td style="font-family: sans-serif; font-size: 15px; vertical-align: top; font-weight: bold; text-transform: capitalize;">${name}: </td>
			<td style="font-family: sans-serif; font-size: 15px; vertical-align: top;">${value}</td>
		</tr>
	`;
};
