const campaign = require('./data/campaigns/1689103366291.json');



exports.handler = async function (event, context) {
    console.log('Loading test.json file now');
    const testData = require('./data/test.json');

    return {
        statusCode: 200,
        body: JSON.stringify({ message: '/test', testdata: testData, campaign: campaign }, null, 4)
    }
}
