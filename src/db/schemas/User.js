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

module.exports = UserSchema;