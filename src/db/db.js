const userSchema = require('./schemas/User');
const publicationSchema = require('./schemas/Publication');
const loanSchema = require('./schemas/Loan');
const reviewSchema = require('./schemas/Review');

module.exports = (context) => {
    const configFactory = context('config');
    const config = configFactory(context);
    const info = config[process.env.NODE_ENV || 'development'];
    const mongoose = context('mongoose');

    const connectionString = `mongodb+srv://${info.mongoUser}:${info.mongoPass}@academic-reference-manager-xy9f5.mongodb.net/${info.mongoCollection}?retryWrites=true&w=majority`;

    const connection = mongoose.createConnection(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });

    return {
        connection: connection,
        User: connection.model('User', userSchema),
        Publication: connection.model('Publication', publicationSchema),
        Loan: connection.model('Loan', loanSchema),
        Review: connection.model('Review', reviewSchema)
    };
}
