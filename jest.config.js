module.exports = async () => {
    return {
        verbose: true,
        collectCoverageFrom: [
            "**/*.js",
            "!jest.config.js",
            "!__mocks__/**",
            "!**/node_modules/**",
            "!coverage/**"
        ]
    };
};
