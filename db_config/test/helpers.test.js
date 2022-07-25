const { camelizeKeys, logConsole } = require("../helpers");

describe("Test Helpers File", () => {
    test("camelizeKeys should return object with capitalized keys for Object", () => {
        expect(camelizeKeys({ key_capital: 123 })).toStrictEqual({
            keyCapital: 123
        });
    });

    test("camelizeKeys should return object with capitalized keys for Array", () => {
        expect(camelizeKeys([{ key_capital: 123 }])).toStrictEqual([
            { keyCapital: 123 }
        ]);
    });

    test("logConsole should call console.log", () => {
        console.log = jest.fn();
        logConsole("text");
        expect(console.log).toHaveBeenCalled();
    });
});
