const Schema = require('mongoose').Schema;

module.exports = Schema({
    id: { type: Number, required: true },
    editor_first_name: { type: String, required: true },
    editor_last_name: { type: String },
    publication_title: { type: String, required: true },
    isbn: { type: String, require: true },
    type: { type: String, enum: ['printed', 'electronic', null] },
    journal: { type: String },
    year: { type: Number, min: 0, max: 2100 }

}, { versionKey: false, _id: false })

