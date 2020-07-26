const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const tasks = require('../task/mongo-tasks');
it.optional = require('../extensions/it-optional');


describe('mongo-tasks', async function() {
    let dbconnection;
    let client;

    before(async function() {
        this.timeout(15000);
        const url = process.env.MONGO_HOST || 'mongodb://localhost:27017';
        const dbName = process.env.MONGO_DB || 'northwind';

        client = await MongoClient.connect(url);
        dbconnection = client.db(dbName);

        await tasks.before(dbconnection);
    });

    it.optional('task_1_1', async function() {
        assert.deepEqual(await tasks.task_1_1(dbconnection), require('./mongo_json/task_1_1.json'));
    });

    it.optional('task_1_2', async function() {
        assert.deepEqual(await tasks.task_1_2(dbconnection), require('./mongo_json/task_1_2.json'));
    });

    it.optional('task_1_3', async function() {
        assert.deepEqual(await tasks.task_1_3(dbconnection), require('./mongo_json/task_1_3.json'));
    });

    it.optional('task_1_4', async function() {
        assert.deepEqual(await tasks.task_1_4(dbconnection), require('./mongo_json/task_1_4.json'));
    });

    it.optional('task_1_5', async function() {
        assert.deepEqual(await tasks.task_1_5(dbconnection), require('./mongo_json/task_1_5.json'));
    });

    it.optional('task_1_6', async function() {
        assert.deepEqual(await tasks.task_1_6(dbconnection), require('./mongo_json/task_1_6.json'));
    });

    it.optional('task_1_7', async function() {
        assert.deepEqual(await tasks.task_1_7(dbconnection), require('./mongo_json/task_1_7.json'));
    });

    it.optional('task_1_8', async function() {
        assert.deepEqual(await tasks.task_1_8(dbconnection), require('./mongo_json/task_1_8.json'));
    });

    it.optional('task_1_9', async function() {
        assert.deepEqual(await tasks.task_1_9(dbconnection), require('./mongo_json/task_1_9.json'));
    });

    it.optional('task_1_10', async function() {
        assert.deepEqual(await tasks.task_1_10(dbconnection), require('./mongo_json/task_1_10.json'));
    });

    it.optional('task_1_11', async function() {
        assert.deepEqual(await tasks.task_1_11(dbconnection), require('./mongo_json/task_1_11.json'));
    });

    it.optional('task_1_12', async function() {
        assert.deepEqual(await tasks.task_1_12(dbconnection), require('./mongo_json/task_1_12.json'));
    });

    it.optional('task_1_13', async function() {
        assert.deepEqual(await tasks.task_1_13(dbconnection), require('./mongo_json/task_1_13.json'));
    });

    it.optional('task_1_14', async function() {
        assert.deepEqual(await tasks.task_1_14(dbconnection), require('./mongo_json/task_1_14.json'));
    });

    it.optional('task_1_15', async function() {
        assert.deepEqual(await tasks.task_1_15(dbconnection), require('./mongo_json/task_1_15.json'));
    });

    it.optional('task_1_16', async function() {
        assert.deepEqual(await tasks.task_1_16(dbconnection), require('./mongo_json/task_1_16.json'));
    });

    it.optional('task_1_17', async function() {
        assert.deepEqual(await tasks.task_1_17(dbconnection), require('./mongo_json/task_1_17.json'));
    });

    it.optional('task_1_18', async function() {
        assert.deepEqual(await tasks.task_1_18(dbconnection), require('./mongo_json/task_1_18.json'));
    });

    it.optional('task_1_19', async function() {
        assert.deepEqual(await tasks.task_1_19(dbconnection), require('./mongo_json/task_1_19.json'));
    });

    it.optional('task_1_20', async function() {
        assert.deepEqual(await tasks.task_1_20(dbconnection), require('./mongo_json/task_1_20.json'));
    });

    it.optional('task_1_21', async function() {
        assert.deepEqual(await tasks.task_1_21(dbconnection), require('./mongo_json/task_1_21.json'));
    });

    it.optional('task_1_22', async function() {
        assert.deepEqual(await tasks.task_1_22(dbconnection), require('./mongo_json/task_1_22.json'));
    });
    after(function () {
        client.close();
    })
});
