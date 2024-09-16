const index = (req, res) =>
	res.status(200).json({ code: 200, message: 'Welcome to API Template Nodejs Prefix' })

module.exports = {
	index
}
