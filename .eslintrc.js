module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true
	},
	extends: ['standard', 'prettier'],
	overrides: [
		{
			files: ['**/*.test.js', '**/*.test.jsx'],
			env: {
				jest: true
			}
		}
	],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	rules: {}
}
