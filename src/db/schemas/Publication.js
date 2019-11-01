const mongoose = require('mongoose');

const PublicationSchema = mongoose.Schema(
    {
        editor_first_name: { type: String, required: true },
        editor_last_name: { type: String },
        publication_title: { type: String, required: true },
        isbn: { type: String, required: true },
        type: { type: String, enum: ['printed', 'electronic', null] },
        journal: { type: String },
        year: { type: Number, min: 0, max: 2100 },
        reviews: [
            {
                _id: false,
                user: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' },
                rating: { type: Number, min: 1, max: 5, required: true }
            }
        ]
    },
    {
        versionKey: false,
    }
);
PublicationSchema.statics = {
    getAllPublications: function () {
        return this.find({}).select('-reviews');
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
            { new: true }
        );
    },
    getAllReviews: function () {
        return this.find({
            reviews: {
                $exists: true,
                $not: { $size: 0 }
            }
        }).select({
            _id: true,
            publication_title: true,
            reviews: true
        })
    },
    getReviewsByPublicationId: function (id) {
        return this.findById(id).select({ reviews: 1, publication_title: 1 });
    },
    getReviewByPublicationAndUserId: function (publicationId, userId) {
        return this.findOne({
            _id: publicationId,
            reviews: {
                $elemMatch: {
                    user: userId
                }
            }
        }).select({ reviews: 1, publication_title: 1 });
    },
    updateUserReview: function (publicationId, userId, review) {
        return this.findOneAndUpdate(
            {
                _id: publicationId,
                reviews: {
                    $elemMatch: {
                        user: userId
                    }
                }
            },
            {
                $set: { "reviews.$.rating": review.rating }
            },
            {
                new: true
            }
        )
    },
    removeUserReview: function (publicationId, userId, review) {
        return this.findOneAndUpdate(
            {
                _id: publicationId
            },
            {
                $pull: {
                    reviews: {
                        user: userId
                    }
                }
            },
            {
                new: true
            }
        )
    }

}

module.exports = PublicationSchema;

