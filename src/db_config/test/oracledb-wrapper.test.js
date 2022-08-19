const { select } = require('../oracledb-wrapper');

describe("Test Oracledb Wrapper File", () => {
    test("select should call db", async () => {
        const { success } = await select('SELECT * FROM table WHERE 1=1');
        expect(success).toBeTruthy();
    });

    test("select should call not db", async () => {
        try {
            await select(null)
        } catch (error) {
            expect(error).toBeDefined();
        }
    });
});