const mongoose = require('mongoose');
const loanStatics = require('../statics/LoanStatics');

const LoanSchema = mongoose.Schema(
    {
        user: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' },
        publication: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Publication' },
        borrow_date: { type: Date, required: true },
        return_date: { type: Date, default: null, validate: [dateValidator, '`return_date` must be later than `borrow_date`'] }
    },
    {
        versionKey: false
    }
);

function dateValidator(value) {
    return (this.borrow_date <= value) || value == null
}

LoanSchema.statics = loanStatics;

module.exports = LoanSchema;