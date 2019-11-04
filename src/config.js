/**
 * Configuration for application environments
 */

module.exports = (context) => ({
    development: {
        // mongoDB
        mongoUser: "admin",
        mongoPass: "ARMadmin",
        mongoCollection: "development"
    },
    test: {
        // mongodb
        mongoUser: "admin",
        mongoPass: "ARMadmin",
        mongoCollection: "test"
    },
    production: {
        mongoUser: "admin",
        mongoPass: "ARMadmin",
        mongoCollection: "production"
    }

})
