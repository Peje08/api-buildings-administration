const { rowsFormat, logConsole } = require('../helpers')

describe('Test Helpers File', () => {
	test('camelizeKeys should return object with capitalized keys for Object', () => {
		expect(rowsFormat('', { key_capital: 123 })).toStrictEqual({ key_capital: 123 })
	})

	test('camelizeKeys should return object with capitalized keys for Object', () => {
		expect(rowsFormat('camelizeKeys', { key_capital: 123 })).toStrictEqual({ keyCapital: 123 })
	})

	test('camelizeKeys should return object with capitalized keys for Array', () => {
		expect(rowsFormat('camelizeKeys', [{ key_capital: 123 }])).toStrictEqual([{ keyCapital: 123 }])
	})

	test('snakelizeKeys should return object with capitalized keys for Object', () => {
		expect(rowsFormat('snakelizeKeys', { keyCapital: 123 })).toStrictEqual({ key_capital: 123 })
	})

	test('snakelizeKeys should return object with capitalized keys for Array', () => {
		expect(rowsFormat('snakelizeKeys', [{ keyCapital: 123 }])).toStrictEqual([{ key_capital: 123 }])
	})

	test('logConsole should call console.log', () => {
		console.log = jest.fn()
		logConsole('text')
		expect(console.log).toHaveBeenCalled()
	})
})
