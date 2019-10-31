module.exports = (context) => {
    const dbProvider = require("../db/db");

    const getAllPublications = (cb, errorCb) => {
        dbProvider.Publication.find({})
    };
}