const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String
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
			type: String
		},
		type: {
			type: String,
			enum: ['SUPERUSER', 'TENANT', 'OWNER', 'ADMINISTRATION']
		},
		resetPasswordToken: String,
		resetPasswordExpires: Date,
		isActive: {
			type: Boolean,
			default: true
		}
	},
	{ timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)
