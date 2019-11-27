'use strict';

module.exports = function (name, value) {
    name = name.replace(/([A-Z])/g, ' $1').toLowerCase();
    return `${name}: ${value}`;
};
