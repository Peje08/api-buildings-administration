const request = require('supertest');
const express = require('express');
const router = require('./');
require("../globalConfig");

const app = new express();
app.use('/', router);

describe('Api routes', function () {
  test('Get / should respond OK', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual(JSON.stringify({code:200,message:'Welcome to API Template Nodejs Prefix'}));
  });
});