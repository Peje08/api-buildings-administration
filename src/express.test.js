const request = require('supertest')
const expressRouter = require('./express')

describe('Test express router', () => {
	test('It should response the GET method', async () => {
		const response = await request(expressRouter).get('/')
		expect(response.statusCode).toBe(200)
	})
})
