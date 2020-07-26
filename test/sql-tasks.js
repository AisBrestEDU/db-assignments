
const assert = require('assert');
const mysql      = require('mysql2/promise');
const tasks = require('../task/sql-tasks');
it.optional = require('../extensions/it-optional');


describe('sql-tasks', function() {
    let dbconnection;

    before(async function() {
        dbconnection = await mysql.createConnection({
            host     : process.env.HOST || 'localhost',
            user     : process.env.USER_NAME || 'root',
            password : process.env.PASSWORD || 'password',
            database : process.env.DATABASE || 'northwind'
        })
    });

    it.optional('task_1_1', async function() {
        assert.deepEqual(await tasks.task_1_1(dbconnection), require('./sql_json/task_1_1.json'));
    });

    it.optional('task_1_2', async function() {
        assert.deepEqual(await tasks.task_1_2(dbconnection), require('./sql_json/task_1_2.json'));
    });

    it.optional('task_1_3', async function() {
        assert.deepEqual(await tasks.task_1_3(dbconnection), require('./sql_json/task_1_3.json'));
    });

    it.optional('task_1_4', async function() {
        assert.deepEqual(await tasks.task_1_4(dbconnection), require('./sql_json/task_1_4.json'));
    });

    it.optional('task_1_5', async function() {
        assert.deepEqual(await tasks.task_1_5(dbconnection), require('./sql_json/task_1_5.json'));
    });

    it.optional('task_1_6', async function() {
        assert.deepEqual(await tasks.task_1_6(dbconnection), require('./sql_json/task_1_6.json'));
    });

    it.optional('task_1_7', async function() {
        assert.deepEqual(await tasks.task_1_7(dbconnection), require('./sql_json/task_1_7.json'));
    });

    it.optional('task_1_8', async function() {
        assert.deepEqual(await tasks.task_1_8(dbconnection), require('./sql_json/task_1_8.json'));
    });

    it.optional('task_1_9', async function() {
        assert.deepEqual(await tasks.task_1_9(dbconnection), require('./sql_json/task_1_9.json'));
    });

    it.optional('task_1_10', async function() {
        assert.deepEqual(await tasks.task_1_10(dbconnection), require('./sql_json/task_1_10.json'));
    });

    it.optional('task_1_11', async function() {
        assert.deepEqual(await tasks.task_1_11(dbconnection), require('./sql_json/task_1_11.json'));
    });

    it.optional('task_1_12', async function() {
        assert.deepEqual(await tasks.task_1_12(dbconnection), require('./sql_json/task_1_12.json'));
    });

    it.optional('task_1_13', async function() {
        assert.deepEqual(await tasks.task_1_13(dbconnection), require('./sql_json/task_1_13.json'));
    });

    it.optional('task_1_14', async function() {
        assert.deepEqual(await tasks.task_1_14(dbconnection), require('./sql_json/task_1_14.json'));
    });

    it.optional('task_1_15', async function() {
        assert.deepEqual(await tasks.task_1_15(dbconnection), require('./sql_json/task_1_15.json'));
    });

    it.optional('task_1_16', async function() {
        assert.deepEqual(await tasks.task_1_16(dbconnection), require('./sql_json/task_1_16.json'));
    });

    it.optional('task_1_17', async function() {
        assert.deepEqual(await tasks.task_1_17(dbconnection), require('./sql_json/task_1_17.json'));
    });

    it.optional('task_1_18', async function() {
        assert.deepEqual(await tasks.task_1_18(dbconnection), require('./sql_json/task_1_18.json'));
    });

    it.optional('task_1_19', async function() {
        assert.deepEqual(await tasks.task_1_19(dbconnection), require('./sql_json/task_1_19.json'));
    });

    it.optional('task_1_20', async function() {
        assert.deepEqual(await tasks.task_1_20(dbconnection), require('./sql_json/task_1_20.json'));
    });

    it.optional('task_1_21', async function() {
        assert.deepEqual(await tasks.task_1_21(dbconnection), require('./sql_json/task_1_21.json'));
    });

    it.optional('task_1_22', async function() {
        assert.deepEqual(await tasks.task_1_22(dbconnection), require('./sql_json/task_1_22.json'));
    });

    after(function () {
        dbconnection.close();
    })
});
