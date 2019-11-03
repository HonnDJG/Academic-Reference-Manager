const ObjectId = require('mongoose').Types.ObjectId;
const boom = require('@hapi/boom');

module.exports = {
    checkExistence: async function (l_id) {
        const found = await this.findById(l_id);
        if (!found) throw boom.notFound(`Loan of ID: ${l_id} does not exist`);
    },
    getLoansByUserId: function (u_id) {
        return this.find({ user: u_id });
    },
    getLoansByPublicationId: function (p_id) {
        return this.find({ publication: p_id });
    },
    getLoanByPublicationAndUserId: function (p_id, u_id) {
        return this.findOne({
            publication: p_id,
            user: u_id
        });
    },
    getPublicationsOnLoanByDates: function (borrow_date, return_date) {
        return this.aggregate([
            { $match: { borrow_date: { $lte: borrow_date }, $or: [{ return_date: { $gt: return_date } }, { return_date: null }] } },
            { $group: { _id: null, publication: { $addToSet: "$publication" } } },
            { $unwind: "$publication" },
            { $lookup: { from: 'publications', localField: 'publication', foreignField: '_id', as: 'publication' } },
            { $unwind: "$publication" },
            { $replaceRoot: { newRoot: "$publication" } }
        ]);
    },
    getPublicationsOnLoanByDateAndUserId: function (u_id, date) {
        const u_oid = ObjectId(u_id);
        return this.aggregate([
            { $match: { user: u_oid, borrow_date: { $lte: date }, $or: [{ return_date: { $gt: date } }, { return_date: null }] } },
            { $group: { _id: null, publication: { $addToSet: "$publication" } } },
            { $unwind: "$publication" },
            { $lookup: { from: 'publications', localField: 'publication', foreignField: '_id', as: 'publication' } },
            { $unwind: "$publication" },
            { $replaceRoot: { newRoot: "$publication" } }
        ])
    },
    getUsersOnLoanByDates: function (borrow_date, return_date) {
        return this.aggregate([
            { $match: { borrow_date: { $lte: borrow_date }, $or: [{ return_date: { $gt: return_date } }, { return_date: null }] } },
            { $group: { _id: null, user: { $addToSet: "$user" } } },
            { $unwind: "$user" },
            { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
            { $unwind: "$user" },
            { $replaceRoot: { newRoot: "$user" } }
        ]);
    },
}