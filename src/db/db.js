const friendSchema = require('./schemas/Friend');
const publicationSchema = require('./schemas/Publication');
const mongoose = require('mongoose');

module.exports = (context) => {
    const configFactory = context('config');
    const config = configFactory(context);

    const connectionString = `mongodb+srv://${config.mongoUser}:${config.mongoPass}@academic-reference-manager-xy9f5.mongodb.net/${config.mongoCollection}?retryWrites=true&w=majority`;

    const connection = mongoose.createConnection(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    return {
        Friend: connection.model('Friend', friendSchema),
        Publication: connection.model('Publication', publicationSchema)
    };
}
