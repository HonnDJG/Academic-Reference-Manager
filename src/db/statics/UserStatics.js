const mongoose = require('mongoose');
const boom = require('@hapi/boom');

module.exports = {
    checkExistence: async function (u_id) {
        const found = await this.findById(u_id);
        if (!found) throw boom.notFound(`User of ID: ${u_id} does not exist`);
    },
    getAllUsers: function () {
        return this.find({});
    },
    getAllUsersWithLoansLongerThanDurationOnDate: function (borrow_date, return_date) {
        return this.find({
            publications: {
                $elemMatch: {
                    borrow_date: { $lte: borrow_date },
                    $or: [
                        { return_date: { $gt: return_date } },
                        { return_date: null }
                    ]
                }
            }
        });
    },
    getAllUsersWithOnGoingLoanOnDate: function (query_date) {
        return this.find({
            publications: {
                $elemMatch: {
                    borrow_date: { $lte: query_date },
                    $or: [
                        { return_date: { $gt: query_date } },
                        { return_date: null }
                    ]
                }
            }
        })
    },
    getOnGoingLoansOfPublication: function (publicationId, borrow_date) {
        return this.find({
            publications: {
                $elemMatch: {
                    $or: [
                        {
                            publication: publicationId,
                            borrow_date: { $lte: borrow_date },
                            $or: [
                                { return_date: { $gt: borrow_date } },
                                { return_date: null }
                            ]
                        },
                        {
                            publication: publicationId,
                            borrow_date: { $gte: borrow_date },
                            return_date: null
                        }
                    ]
                }
            }
        })
    },

    createUser: function (user) {
        return this.create(user);
    },

    getUserWithId: function (id) {
        return this.findOne({
            _id: id
        });
    },

    deleteUser: function (id) {
        return this.findOneAndDelete({
            _id: id
        });
    },

    updateUser: function (id, body) {
        return this.findOneAndUpdate(
            { _id: id },
            { $set: body },
            { new: true, runValidators: true }
        );
    },

    getPublicationByUserId: function (id) {
        return this.findOne(
            { _id: id },
            {
                _id: 0,
                publications: 1
            })
    },

    loanPublicationForUser: function (uid, loan) {
        return this.findOneAndUpdate(
            { _id: uid },
            { $push: { publications: loan } },
            { new: true, runValidators: true }
        )
    },

    getUserswithPublication: function (pid) {
        return this.find({
            publications: {
                $elemMatch: {
                    publication: pid
                }
            }

        });
    },

    updateLoan: function (loan, uid, lid) {
        return this.findOneAndUpdate(
            {
                _id: uid,
                publications: {
                    $elemMatch: {
                        _id: lid,
                    }
                }
            },
            { $set: { "publications.$": loan } },
            { new: true, runValidators: true }
        )
    }
}