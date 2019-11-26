'use strict';

module.exports = function (name, value) {
    return `${name.replace( /([A-Z])/g, ' $1' ).toUpperCase()}: ${value}`;
};
