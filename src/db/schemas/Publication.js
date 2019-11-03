const mongoose = require('mongoose');
const publicationStatics = require('../statics/PublicationStatics');
const reviewStatics = require("../statics/ReviewStatics");

const PublicationSchema = mongoose.Schema(
    {
        editor_first_name: { type: String, required: true },
        editor_last_name: { type: String, default: null },
        publication_title: { type: String, required: true },
        isbn: { type: String, required: true },
        type: { type: String, enum: ['printed', 'electronic', null], default: null },
        journal: { type: String, default: null },
        year: { type: Number, min: 0, max: 2100, default: null },
    },
    {
        versionKey: false
    }
);

PublicationSchema.statics = { ...publicationStatics, ...reviewStatics };

module.exports = PublicationSchema;

