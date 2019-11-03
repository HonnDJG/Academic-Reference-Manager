const boom = require('@hapi/boom');

module.exports = {
    checkExistence: async function (r_id) {
        const found = await this.findById(r_id);
        if (!found) throw boom.notFound(`Review of ID: ${r_id} does not exist`);
    },

    getAllReviews: function () {
        return this.find({});
    },

    getReviewsByPublicationId: function (p_id) {
        return this.find({ publication: p_id })
    },

    getReviewsByUserId: function (u_id) {
        return this.find({
            user: u_id
        });
    },

    getReviewByPublicationAndUserId: function (p_id, u_id) {
        return this.findOne({
            user: u_id,
            publication: p_id
        });
    },

    createUserReview: function (ratingObject) {
        return this.create(ratingObject);
    },

    updateUserReview: function (p_id, u_id, body) {
        return this.findOneAndUpdate({ 
            user: u_id, 
            publication: p_id 
        },
        { $set: body },
        { new: true, runValidators: true });
    },

    removeUserReview: function (p_id, u_id) {
        return this.findOneAndDelete({ 
            user: u_id, 
            publication: p_id 
        });
    }
}