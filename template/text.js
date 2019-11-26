'use strict';

module.exports = function (data, lines) {
    return `
		Hello,

		You have recieved a ${data.$name} submission from ${data.$domain}.

		${lines.join('\n')}

		Powered By ${data.$byName}
	`;
};
