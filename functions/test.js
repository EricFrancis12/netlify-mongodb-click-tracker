const mongoose = require('mongoose')
const dbConnection = mongoose.connect(process.env.MONGODB_URI_LOCAL || process.env.MONGODB_URI)
    .then(() => console.log('Connected to DB'));

const Click = require('../models/Click');



exports.handler = async function (event, context) {
    console.log('Loading test.json file now');
    const testData = require(`./data/campaigns/test.json`);

    const campaignPath = `./data/campaigns/1689103366291.json`;
    const campaign = require(campaignPath);

    await dbConnection;
    const clicks = await Click.find({});

    return {
        statusCode: 200,
        body: JSON.stringify({ message: '/test', testdata: testData, campaign: campaign, event: event, clicks: clicks }, null, 4)
    }
}
