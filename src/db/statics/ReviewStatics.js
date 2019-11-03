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

    updateUserReview: function (p_id, u_id, review) {
        return this.findOneAndUpdate();
    },

    removeUserReview: function (p_id, u_id, review) {
        return this.findOneAndUpdate();
    },

    getRecommendationExcludingBorrowed: function (borrowed_p_id_list) {
        return this.aggregate([
            { $match: { publication: { $nin: borrowed_p_id_list } } },
            { $group: { _id: '$publication', average_rating: { $avg: "$rating" } } },
            { $lookup: { from: 'publications', localField: '_id', foreignField: '_id', as: 'publication' } },
            { $unwind: '$publication' },
            { $sort: { "average_rating": -1 } },
            { $replaceRoot: { newRoot: { $mergeObjects: [{ average_rating: '$average_rating' }, "$publication"] } } },
        ])
    }
}