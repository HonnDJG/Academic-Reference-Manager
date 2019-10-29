const mongoose = require('mongoose');
require('mongoose-type-email');

module.exports = mongoose.Schema({
	id: { type: Number, required: true },
	first_name: { type: String, required: true },
	last_name: { type: String },
	address: { type: String },
	phone: {
		type: String,
		validate: {
			validator: function (v) {
				return /(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})/.test(v);
			}
		}
	},
	email: { type: mongoose.SchemaTypes.Email, required: true },
	publications: [
		{
			id: { type: Number, required: true },
			borrow_date: { type: Date, required: true },
			return_date: { type: Date }
		}
	]
}, { versionKey: false, _id: false });