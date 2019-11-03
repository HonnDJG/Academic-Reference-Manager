const mongoose = require('mongoose');
const boom = require('@hapi/boom');

module.exports = {
    checkExistence: async function (u_id) {
        const found = await this.findById(u_id);
        if (!found) throw boom.notFound(`User of ID: ${u_id} does not exist or removed`);
    },
    getAllUsers: function () {
        return this.find({});
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
}