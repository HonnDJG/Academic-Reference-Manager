/**
 * Permission middleware
 */

const boom = require('@hapi/boom');

module.exports = (...allowed) => {
    const isAllowed = role => (allowed.indexOf(role) > -1);

    return (req, res, next) => {
        const role = req.headers.authorization;

        if (role && isAllowed(role)) {
            next();
        } else {
            const boomInit = boom.unauthorized('You do not have the rights to do this action!');
            const msg = boomInit.output.payload;
            res.status(msg.statusCode).send(msg);
        }
    }
}