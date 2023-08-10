require('dotenv').config();

const mongoose = require('mongoose')
const dbConnection = mongoose.connect(process.env.MONGODB_URI_LOCAL || process.env.MONGODB_URI)
    .then(() => console.log('Connected to DB'));

const Click = require('../models/Click');



exports.handler = async function (event, context) {
    const timestamp = Date.now();
    const defaultReturn = {
        statusCode: 200,
        body: '{}'
    };

    const click_id = event.queryStringParameters.click_id;
    if (!click_id) return defaultReturn;

    const click = await Click.findOne({ click_id: click_id });
    if (!click) return defaultReturn;

    click.conversion = true;
    click.conversionTimestamp = timestamp;
    click.revenue += parseFloat(event.queryStringParameters.payout) || 0;

    await click.save();
    console.log(click);

    return defaultReturn;
}
