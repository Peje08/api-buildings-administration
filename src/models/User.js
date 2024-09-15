const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
		nombre: {
			type: String,
			required: true
		},
		correo: {
			type: String,
			required: true,
			unique: true
		},
		clave: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)
