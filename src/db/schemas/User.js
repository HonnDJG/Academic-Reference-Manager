const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
	{
		first_name: { type: String, required: true },
		last_name: { type: String },
		address: { type: String },
		phone: {
			type: String,
			match: [/(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})/, 'Please enter a valid phone number']
		},
		email: {
			type: String,
			required: true,
			match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
		},
		publications: [
			{
				publication: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Publication' },
				borrow_date: { type: Date, required: true },
				return_date: { type: Date }
			}
		]
	},
	{
		versionKey: false
	}
);


UserSchema.statics = {
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
			{ new: true }
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

	loanPublication: function (loan, uid) {
		return this.findOneAndUpdate(
			{ _id: uid },
			{ $push: { publications: loan } },
			{ new: true }
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
			{ new: true }
		)
	},
}

module.exports = UserSchema;