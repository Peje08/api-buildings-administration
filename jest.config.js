module.exports = async () => {
	return {
		verbose: true,
		setupFiles: ['./setup-env.js'],
		collectCoverageFrom: [
			'**/*.js',
			'!jest.config.js',
			'!setup-env.js',
			'!src/app.js',
			'!coverage/**'
		],
		reporters: [
			'default',
			[
				'jest-sonar',
				{
					outputDirectory: 'reports',
					outputName: 'test-report.xml',
					reportedFilePath: 'absolute'
				}
			]
		]
	}
}
