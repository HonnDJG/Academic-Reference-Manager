const mongoose = require('mongoose');

const reviewStatics = require('../statics/ReviewStatics');

const ReviewSchema = mongoose.Schema(
    {
        user: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' },
        publication: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Publication' },
        rating: { type: Number, min: 1, max: 5, required: true }
    },
    {
        versionKey: false,
    }

);

ReviewSchema.statics = reviewStatics

module.exports = ReviewSchema;