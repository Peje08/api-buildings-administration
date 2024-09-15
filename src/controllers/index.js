const User = require('../models/User')
const Post = require('../models/Post')

const index = (req, res) =>
	res.status(200).json({ code: 200, message: 'Welcome to API Template Nodejs Prefix' })

const controllerFuncSelectPosts = async (req, res) => {
	try {
		const posts = await Post.find().populate('autor', 'nombre correo')
		res.status(200).json(posts)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

const controllerFuncSelectUsers = async (req, res) => {
	try {
		const users = await User.find()
		res.status(200).json(users)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

const controllerFuncExecute = async (req, res) => {
	try {
		const { nombre, correo, clave } = req.body

		// Crear un nuevo usuario
		const nuevoUsuario = new User({ nombre, correo, clave })
		await nuevoUsuario.save()

		res.status(201).json(nuevoUsuario)
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
}

module.exports = {
	index,
	controllerFuncSelectPosts,
	controllerFuncExecute,
	controllerFuncSelectUsers
}
