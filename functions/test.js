const data = require('../data/data');



exports.handler = async function (event, context) {
    console.log('Loading test.json file now');
    const testData = require('./data/test.json');
    console.log(testData);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: '/test', testdata: testData, data: data }, null, 4)
    }
}
