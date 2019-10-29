const inject = require('./inject.js');
const express = require('express');
const db = require('../db/db');
const server = require('../server');

const publicationsRoute = require('../routes/publicationsRoute');
const usersRoute = require('../routes/usersRoute');

module.exports = {
    newContext: () => {
        return inject({
            express,
            db,
            server,
            publicationsRoute,
            usersRoute,
        });
    },
};

