const boom = require('@hapi/boom');

module.exports = {
    /// tested
    checkExistence: async function (p_id) {
        const found = await this.findById(p_id);
        if (!found) throw boom.notFound(`Publication of ID: ${p_id} does not exist or has been removed`);
    },

    /// tested
    getAllPublications: function () {
        return this.find({});
    },

    /// tested
    createPublication: function (publication) {
        return this.create(publication);
    },
    
    /// tested
    getPublicationById: function (id) {
        return this.findById(id);
    },

    /// tested
    removePublicationById: function (id) {
        return this.remove({ _id: id });
    },

    
    updatePublicationById: function (id, body) {
        return this.findOneAndUpdate(
            { _id: id },
            { $set: body },
            { new: true, runValidators: true }
        );
    },
}