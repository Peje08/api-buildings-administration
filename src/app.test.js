const app = require('./app')
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

describe('Test the root path', () => {
	test('server should initiate', async () => {
		const appRun = await app
		await delay(100)
		expect(appRun).toBeTruthy()
	})
})

afterAll(() => {
	app.server.close()
})
