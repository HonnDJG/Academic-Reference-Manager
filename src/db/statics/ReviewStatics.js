const boom = require('@hapi/boom');

module.exports = {

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
    },

    // gets a list recommended publication not in the borrowed_p_id_list array (of p_ids), grouped together by publication_id, averages the ratings and shows it
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