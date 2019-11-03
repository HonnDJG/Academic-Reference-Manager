const boom = require('@hapi/boom');

module.exports = ( userType, ...allowed) => {
    const isAllowed = role => (allowed.indexOf(role) > -1);

    if (!(userType && isAllowed(userType))) {
        throw boom.unauthorized('You do not have the rights to do this action!');
    }
}