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
            dateMakers: require('../services/helpers/dateMakers'),
            overlapChecker: require('../services/helpers/overlapChecker'),
            permission: require('../utils/permission')
        });
    },
};

