const friendSchema = require('./schemas/Friend');
const publicationSchema = require('./schemas/Publication');
const mongoose = require('mongoose');

const connection = mongoose.createConnection('mongodb+srv://admin:ARMadmin@academic-reference-manager-xy9f5.mongodb.net/production?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = {
    Friend: connection.model('Friend', friendSchema),
    Publication: connection.model('Publication', publicationSchema)
};
