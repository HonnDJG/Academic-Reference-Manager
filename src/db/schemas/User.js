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
				_id: false,
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
	getAllUsersWithLoanOnDate: function (query_date) {
		return this.find({
			publications: {
				$elemMatch: {
					borrow_date: { $lte: query_date },
					$or: [
						{ return_date: null },
						{ return_date: { $gt: query_date } }
					]
				}
			}
		});
	},
	getAllUsersWithLoansLongerThanDuration: function (borrow_date, return_date) {
		return this.find({
			publications: {
				$elemMatch: {
					borrow_date: { $lte: borrow_date },
					$or: [
						{ return_date: null },
						{ return_date: { $gt: return_date } }
					]
				}
			}
		});
	},
	getAllUsersWithLoansLongerThanDurationOnDate: function (borrow_date, query_date) {
		return this.find({
			publications: {
				$elemMatch: {
					borrow_date: { $lte: borrow_date },
					$or: [
						{ return_date: { $gte: query_date } },
						{ return_date: null }
					]
				}
			}
		})
	},
	getAllUsersWithOnGoingLoanOnDate: function (query_date) {
		return this.find({
			publications: {
				$elemMatch: {
					borrow_date: { $lte: query_date },
					$or: [
						{ return_date: null },
						{ return_date: { $gte: query_date } }
					]
				}
			}
		})
	}
}

module.exports = UserSchema;