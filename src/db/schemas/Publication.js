const mongoose = require('mongoose');

const PublicationSchema = mongoose.Schema(
    {
        editor_first_name: { type: String, required: true },
        editor_last_name: { type: String },
        publication_title: { type: String, required: true },
        isbn: { type: String, require: true },
        type: { type: String, enum: ['printed', 'electronic', null] },
        journal: { type: String },
        year: { type: Number, min: 0, max: 2100 },
    },
    {
        versionKey: false,
    }
);
PublicationSchema.static()

module.exports = PublicationSchema;

