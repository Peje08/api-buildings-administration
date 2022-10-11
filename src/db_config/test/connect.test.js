const { getPool, createPool } = require('../connect');

describe("Test Connect File", () => {

    test("createPool should not connect on wrong parameters 1", async () => {
        const { online } = await createPool(undefined);
        expect(online).toBeTruthy();
    });

    test("createPool should not connect on empty parameters 2", async () => {
        const { online } = await createPool({
            user: '',
            password: '',
            connectString: '',
            schema:''
        });
        expect(online).toBeTruthy();
    });

    test("createPool should not connect on empty parameters 3", async () => {
        const { online } = await createPool({
            user: '',
            password: '',
            connectString: '',
            schema:''
        }, 'dev');
        expect(online).toBeFalsy();
    });

    test("getPool should call createPool", async () => {
        const { dbPool } = await getPool();
        expect(dbPool).toBeDefined();
        expect(dbPool.getConnection().execute()).toBeDefined();
        expect(dbPool.getConnection().close()).toBeDefined();
        const { dbPool: dbPool2 } = await getPool();
        expect(dbPool2).toBeDefined();
    });
});