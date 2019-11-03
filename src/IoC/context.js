const inject = require('./inject.js');


module.exports = {
    newContext: () => {
        return inject({
            express: require('express'),
            db: require('../db/db'),
            server: require('../server'),
            publicationRoute: require('../routes/publicationRoute'),
            userRoute: require('../routes/userRoute'),
            config: require('../config'),
            publicationService: require('../services/publicationService'),
            userService: require('../services/userService'),
            mongoose: require('mongoose'),
            boom: require('@hapi/boom'),
            permission: require('../utils/permission'),
            reviewService: require('../services/reviewService'),
            throwCreator: require('../services/helpers/throwCreator'),
            moment: require('moment'),
            queryPermission: require('../utils/queryPermission')
        });
    },
};

