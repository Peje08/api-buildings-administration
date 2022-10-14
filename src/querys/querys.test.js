const { query } = require('./')
describe('Test querys', () => {
	test('query return should be string', async () => {
		expect(query()).toBeDefined()
	})
})
