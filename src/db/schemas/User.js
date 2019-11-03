const mongoose = require('mongoose');
const userStatics = require('../statics/UserStatics');

const UserSchema = mongoose.Schema(
	{
		first_name: { type: String, required: true },
		last_name: { type: String, default: null },
		address: { type: String, default: null },
		phone: {
			type: String,
			match: [/(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})/, 'Please enter a valid phone number'],
			default: null
		},
		email: {
			type: String,
			required: true,
			match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
		},
	},
	{
		versionKey: false
	}
);


UserSchema.statics = userStatics;

module.exports = UserSchema;