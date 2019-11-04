const boom = require('@hapi/boom');

module.exports = {

    checkExistence: async function (p_id) {
        const found = await this.findById(p_id);
        if (!found) throw boom.notFound(`Publication of ID: ${p_id} does not exist or has been removed`);
    },


    getAllPublications: function () {
        return this.find({});
    },


    createPublication: function (publication) {
        return this.create(publication);
    },

    getPublicationById: function (id) {
        return this.findById(id);
    },

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