'use strict';

module.exports = function (name, value) {
    return /*html*/`
		<tr>
			<td style="font-family: sans-serif; font-size: 15px; vertical-align: top; text-align: left; font-weight: bold; text-transform: capitalize;">${name}</td>
			<td style="font-family: sans-serif; font-size: 15px; vertical-align: top; text-align: right;">${value}</td>
		</tr>
	`;
};
