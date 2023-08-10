const crypto = require('crypto');
const fs = require('fs');

const inquirer = require('inquirer');

const data = require('../../src/data/data');
const settings = require('../../src/utils/settings');
const strings = require('../../src/utils/strings');
const utils = require('../../src/utils/utils');



const trafficSourceChoices = data.trafficSources.map(trafficSource => trafficSource.name);
const offerChoices = data.offers.map(offer => offer.name);

const landingPageChoices = data.landingPages.map(landingPage => landingPage.name);
landingPageChoices.unshift(strings.landingPages.Direct_Link);

const questions1 = [
    {
        type: 'input',
        name: 'campaignName',
        message: 'Enter campaign name:'
    },
    {
        type: 'list',
        name: 'trafficSourceName',
        message: 'Select traffic source:',
        choices: trafficSourceChoices
    },
    {
        type: 'list',
        name: 'numLandingPages',
        message: 'Select number of landing pages:',
        choices: [1, 2, 3, 4, 5]
    },
    {
        type: 'list',
        name: 'numOffers',
        message: 'Select number of offers:',
        choices: [1, 2, 3, 4, 5]
    },
];



inquirer
    .prompt(questions1)
    .then((answers1) => {
        const questions2 = [];

        questions2.push({
            type: 'list',
            name: 'landingPageRotation',
            message: 'Select landing page rotation',
            choices: ['random']
        });
        questions2.push({
            type: 'list',
            name: 'offerRotation',
            message: 'Select offer rotation',
            choices: ['random']
        });

        for (let i = 0; i < answers1.numLandingPages; i++) {
            questions2.push({
                type: 'list',
                name: `landingPage${i + 1}Name`,
                message: `Select landing page ${i + 1}`,
                choices: landingPageChoices
            });
        } for (let j = 0; j < answers1.numOffers; j++) {
            questions2.push({
                type: 'list',
                name: `offer${j + 1}Name`,
                message: `Select offer ${j + 1}`,
                choices: offerChoices
            });
        }

        questions2.push({
            type: 'input',
            name: 'domain',
            message: 'Enter your root tracking domain in this format: "https://example.com"'
        });

        inquirer.prompt(questions2)
            .then((answers2) => {
                const trafficSource = data.trafficSources.find(trafficSource => trafficSource.name === answers1.trafficSourceName);
                const trafficSourceDataArr = [{
                    _id: trafficSource._id,
                    name: trafficSource.name,
                    fileName: trafficSource.fileName,
                    tokens: trafficSource.tokensArr
                }];

                const answers2Keys = Object.keys(answers2);
                const landingPagesDataArr = [];
                const offersDataArr = [];

                answers2Keys.forEach(key => {
                    const isLandingPage = key.substring(0, 11) === 'landingPage' && key !== 'landingPageRotation';
                    const isOffer = key.substring(0, 5) === 'offer' && key !== 'offerRotation';
                    console.log(isLandingPage);
                    console.log(isOffer);

                    if (isLandingPage) {
                        const landingPage = data.landingPages.find(landingPage => landingPage.name === answers2[key]);

                        if (landingPage) {
                            landingPagesDataArr.push({
                                _id: landingPage._id,
                                name: landingPage.name,
                                url: landingPage.url
                            });
                        } else {
                            landingPagesDataArr.push({
                                _id: strings.landingPages.Direct_Link,
                                name: strings.landingPages.Direct_Link,
                                url: settings.default.smartLink
                            });
                        }
                    } else if (isOffer) {
                        const offer = data.offers.find(offer => offer.name === answers2[key]);

                        if (offer) {
                            offersDataArr.push({
                                _id: offer._id,
                                name: offer.name,
                                url: offer.url,
                                fileName: offer.fileName,
                                affiliateNetwork: {
                                    _id: offer.affiliateNetwork._id,
                                    name: offer.affiliateNetwork.name,
                                    fileName: offer.affiliateNetwork.fileName
                                }
                            });
                        }
                    }
                });


                const timestamp = Date.now();
                const _id = timestamp;
                const timestampFormatted = utils.formatTime(timestamp);
                const fileName = `${_id}.json`;

                let queryString = '';
                trafficSource.tokensArr.forEach(token => {
                    queryString += token.key;
                    queryString += '=';
                    queryString += token.value;
                    queryString += '&';
                });

                const campaignUrl = `${answers2.domain}/.netlify/functions/api?api=${_id}&${queryString}`;

                const defaultCampaign = {
                    _id,
                    timestamp,
                    timestampFormatted,
                    name: answers1.campaignName,
                    fileName,
                    landingPageRotation: answers2.landingPageRotation,
                    offerRotation: answers2.offerRotation,
                    campaignUrl,
                    flow: [
                        {
                            type: 'trafficSource',
                            dataArr: trafficSourceDataArr,
                        },
                        {
                            type: 'landingPage',
                            dataArr: landingPagesDataArr
                        },
                        {
                            type: 'offer',
                            dataArr: offersDataArr
                        }
                    ]
                };
                newCampaign(defaultCampaign);
            })
            .catch((err) => {
                console.error('Error occurred:', err);
            });
    });



function newCampaign(defaultCampaign) {
    const path = `../../src/data/campaigns/${defaultCampaign.fileName}`;
    fs.writeFileSync(path, JSON.stringify(defaultCampaign, null, 4));

    console.log(`New campaign created at ${path}`);
}
