const chai = require("chai");
const sinon = require("sinon");
const oracledb = require("oracledb");
const { select } = require("../oracledb-wrapper");

const expect = chai.expect;

sinon.stub(oracledb, "getConnection").resolves({
    execute: () => ({ 1: "1" }),
    close: () => true
});

describe("Test Oracledb Wrapper File", () => {
    test("select should call db", async () => {
        try {
            await select("SELECT * FROM table WHERE 1=1");
        } catch (error) {
            expect(error).toBeDefined();
        }
    });
});
