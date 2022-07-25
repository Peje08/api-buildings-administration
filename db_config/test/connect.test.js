const { getPool, createPool } = require("../connect");

describe("Test Connect File", () => {
    test("createPool should not connect on wrong parameters", async () => {
        const pool = await createPool(undefined);
        expect(pool).toBeFalsy();
    });

    test("createPool should not connect on empty parameters", async () => {
        const pool = await createPool({
            username: "",
            password: "",
            connectString: ""
        });
        expect(pool).toBeFalsy();
    });
});
