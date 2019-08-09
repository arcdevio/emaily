'use strict';

module.exports = async function (data) {
    return `
		Hello,

		You have recieved a ${data.$name} submission from ${data.$domain}.

		${pairs.join('\n')}

		Powered By ${data.$byName}
	`;
};
