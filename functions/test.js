

exports.handler = async function (event, context) {
    console.log('Loading test.json file now');
    const testData = require('./data/test.json');

    return {
        statusCode: 200,
        body: JSON.stringify({ message: '/test', testdata: testData }, null, 4)
    }
}
