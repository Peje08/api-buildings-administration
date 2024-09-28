const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		lastname: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		cellularNumer: {
			type: String,
			required: true
		},
		type: {
			type: String,
			enum: ['SUPERUSER', 'TENANT', 'OWNER', 'ADMINISTRATION']
		}
	},
	{ timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)
