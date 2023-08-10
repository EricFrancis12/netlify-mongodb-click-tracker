require('dotenv').config();

const mongoose = require('mongoose')
const dbConnection = mongoose.connect(process.env.MONGODB_URI_LOCAL)
    .then(() => console.log('Connected to DB'));

const Click = require('../models/Click');

const settings = require('../utils/settings');
const strings = require('../utils/strings');
const utils = require('../utils/utils');



exports.handler = async function (event, context) {
    const cookies = utils.makeCookieObj(event.headers.cookie || '');

    let click_id = cookies.click_id;
    if (!click_id) click_id = event.queryStringParameters.click_id;

    let campaign_id = cookies.campaign_id;

    try {
        if (!campaign_id) {
            // query database for this click_id, and return the campaign_id associated with it

            // campaign_id = ...
        }

        const campaign = require(`../data/campaigns/${campaign_id}.json`);

        let targetOffer;

        const isRandomRotation = campaign.offerRotation === strings.rotations.random;
        if (isRandomRotation) {
            const numOffers = campaign.flow[2].dataArr.length;
            const randomIndex = utils.randomIntBetween(0, numOffers - 1);
            targetOffer = campaign.flow[2].dataArr[randomIndex];
        } else {
            return {
                statusCode: 302,
                headers: {
                    'Location': settings.default.smartLink
                },
                body: ''
            }
        }

        async function updateClick() {
            await dbConnection;
            const click = await Click.findOne({ click_id: click_id });
            console.log(click);

            click.offerClicked = true;
            click.offer = targetOffer;

            await click.save();
            console.log('Saved click to DB');
        }
        updateClick();

        return {
            statusCode: 302,
            headers: {
                'Location': targetOffer.url
            },
            body: '',
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode: 302,
            headers: {
                'Location': settings.default.smartLink
            },
            body: ''
        }
    }
}
