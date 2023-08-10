require('dotenv').config();

const mongoose = require('mongoose')
const dbConnection = mongoose.connect(process.env.MONGODB_URI_LOCAL)
    .then(() => console.log('Connected to DB'));

const Click = require('../models/Click');

const crypto = require('crypto');

const settings = require('../utils/settings');
const strings = require('../utils/strings');
const utils = require('../utils/utils');



exports.handler = async function (event, context) {
    const timestamp = Date.now();

    try {
        const campaign = require(`../data/campaigns/${event.queryStringParameters.api}.json`);

        const click_id = crypto.randomUUID();
        const newCookies = [
            `click_id=${click_id}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`,
            `campaign_id=${event.queryStringParameters.api}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`
        ];

        const isLandingPage = campaign.flow[1].type === 'landingPage';
        const isOffer = campaign.flow[1].type === 'offer';

        if (!isLandingPage && !isOffer) {
            return {
                statusCode: 302,
                headers: {
                    'Set-Cookie': newCookies,
                    'Location': settings.default.smartLink
                },
                body: '',
            }
        } else {
            let targetLandingPage;

            if (campaign.landingPageRotation === strings.rotations.random) {
                const numBranches = campaign.flow[1].dataArr.length;
                const randomIndex = utils.randomIntBetween(0, numBranches - 1);
                targetLandingPage = campaign.flow[1].dataArr[randomIndex];
            } else {
                return {
                    statusCode: 302,
                    headers: {
                        'Set-Cookie': newCookies,
                        'Location': settings.default.smartLink
                    },
                    body: '',
                }
            }

            const click = {
                timestamp,
                click_id,
                offerClicked: false,
                conversion: false,
                revenue: 0,
                cost: parseFloat(event.queryStringParameters.cost) || 0,
                tokens: [], // these are set right after this
                flow: campaign.flow,
                campaign: {
                    _id: campaign._id,
                    name: campaign.name,
                    fileName: campaign.fileName
                },
                trafficSource: {
                    _id: campaign.flow[0].dataArr[0]._id,
                    name: campaign.flow[0].dataArr[0].name,
                    fileName: campaign.flow[0].dataArr[0].fileName
                },
                landingPage: {
                    _id: campaign.flow[1].dataArr[0]._id,
                    name: campaign.flow[1].dataArr[0].name,
                    fileName: campaign.flow[1].dataArr[0].fileName
                },
                offer: {},
                url: event.rawUrl,
                ip: event.headers['client-ip'],
                userAgent: event.headers['user-agent']
            };

            // add tokens to click:
            const tokens = [];

            for (const [key, value] of Object.entries(event.queryStringParameters)) {
                const campaignTokens = campaign.flow[0].dataArr[0].tokens;

                for (let i = 0; i < campaignTokens.length; i++) {
                    if (campaignTokens[i].key === key) {
                        const newToken = {
                            name: campaignTokens[i].name,
                            key: campaignTokens[i].key,
                            value: value
                        };

                        tokens.push(newToken);
                        break;
                    }
                }
            }
            click.tokens = tokens;

            async function recordClick(_click) {
                console.log(_click);
                await dbConnection;

                const click = new Click(_click);
                await click.save();
                console.log('Saved click to DB');
            }
            recordClick(click);

            const isDirectLink = targetLandingPage._id === strings.landingPages.Direct_Link;
            if (isDirectLink) {
                const numBranches = campaign.flow[2].dataArr.length;
                const randomIndex = utils.randomIntBetween(0, numBranches - 1);
                const targetOffer = campaign.flow[2].dataArr[randomIndex];

                click.offerClicked = true;
                click.offer = {
                    _id: targetOffer._id,
                    name: targetOffer.name,
                    fileName: targetOffer.fileName
                };

                return {
                    statusCode: 302,
                    headers: {
                        'Set-Cookie': newCookies,
                        'Location': targetOffer.url
                    },
                    body: '',
                }
            } else {
                return {
                    statusCode: 302,
                    headers: {
                        'Set-Cookie': newCookies,
                        'Location': targetLandingPage.url
                    },
                    body: '',
                }
            }
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode: 302,
            headers: {
                'Location': targetLandingPage.url
            },
            body: '',
        }
    }
}
