const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const tasks = require('../task/mongo-optimization-task');
it.optional = require('../extensions/it-optional');


describe('mongo-optimization-tasks', async function() {
    let dbconnection;
    let client;

    before(async function() {
        this.timeout(60000);
        const url = process.env.MONGO_HOST || 'mongodb://localhost:27017';
        const dbName = process.env.MONGO_DB || 'awesomedb';

        client = await MongoClient.connect(url, {useUnifiedTopology: true});
        dbconnection = client.db(dbName);

        await tasks.before(dbconnection);
    });

    it.optional('task_3_1', async function() {
        this.timeout(6000);
        let resultStr = JSON.stringify(await tasks.task_3_1(dbconnection));
        let result = JSON.parse(resultStr);
        let expected = require('./mongo_json/task_3_1.json');
        assert.equal(result.length, expected.length);

        const buf1 = Buffer.from(resultStr);
        const buf2 = Buffer.from(JSON.stringify(expected));

        //Compare by hash
        assert.equal(Buffer.compare(buf1, buf2), 0, 'Results are different, please check. It looks like query was broken!');
    });

    after(function () {
        client.close();
    });
});
