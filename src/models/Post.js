const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
	{
		titulo: {
			type: String,
			required: true
		},
		contenido: {
			type: String,
			required: true
		},
		autor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		}
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Post', PostSchema)
