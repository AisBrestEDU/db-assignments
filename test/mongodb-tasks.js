const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const tasks = require('../task/mongo-tasks');
it.optional = require('../extensions/it-optional');


describe('mongo-tasks', async function() {
    let dbconnection;
    let client;
    
    before(async function() {
        const url = process.env.MONGO_HOST || 'mongodb://localhost:27017';
        const dbName = process.env.MONGO_DB || 'northwind';

        client = await MongoClient.connect(url);
        dbconnection = client.db(dbName);
    });
    

    it.optional('task_1_1', async function() {
        assert.deepEqual(await tasks.task_1_1(dbconnection), require('./task_1_1.json'));
    });

    after(function () {
        client.close();
    })
});
