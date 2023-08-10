const crypto = require('crypto');
const fs = require('fs');

const inquirer = require('inquirer');

const data = require('../../src/data/data');
const utils = require('../../src/utils/utils');



const affiliateNetworkChoices = data.affiliateNetworks.map(affiliateNetwork => affiliateNetwork.name);

const questions1 = [
    {
        type: 'input',
        name: 'offerName',
        message: 'Enter offer name:'
    },
    {
        type: 'list',
        name: 'affiliateNetworkName',
        message: 'What affiliate network is the offer on?',
        choices: affiliateNetworkChoices
    },
    {
        type: 'input',
        name: 'offerUrl',
        message: 'Enter offer url:'
    }
];



inquirer
    .prompt(questions1)
    .then((answers1) => {

        const affiliateNetwork = data.affiliateNetworks.find(affiliateNetwork => affiliateNetwork.name === answers1.affiliateNetworkName);

        const questions2 = [
            {
                type: 'list',
                name: 'appendDefaultNewOfferString',
                message: `Do you want to append this network's default new offer string "${affiliateNetwork.defaultNewOfferString}"? (final Url would be: ${answers1.offerUrl + affiliateNetwork.defaultNewOfferString})`,
                choices: ['Yes', 'No']
            },
            {
                type: 'input',
                name: 'offerPayout',
                message: 'Enter offer payout (leave blank for auto):'
            }
        ];

        inquirer
            .prompt(questions2)
            .then((answers2) => {

                const _id = crypto.randomUUID();
                const timestamp = Date.now();
                const timestampFormatted = utils.formatTime(timestamp);
                const fileName = `${utils.camelCase(answers1.offerName)}.json`;

                let url;
                answers2.appendDefaultNewOfferString === 'Yes'
                    ? url = answers1.offerUrl + affiliateNetwork.defaultNewOfferString
                    : url = answers1.offerUrl;

                let payout;
                answers2.offerPayout
                    ? payout = answers2.offerPayout
                    : payout = 'auto';

                const affiliateNetworkEntry = {
                    _id: affiliateNetwork._id,
                    name: affiliateNetwork.name,
                    fileName: affiliateNetwork.fileName
                };

                const defaultOffer = {
                    _id,
                    timestamp,
                    timestampFormatted,
                    name: answers1.offerName,
                    fileName,
                    url,
                    payout,
                    geos: ['global'],
                    affiliateNetwork: affiliateNetworkEntry
                };
                newOffer(defaultOffer);
            });
    })
    .catch((err) => {
        console.error('Error occurred:', err);
    });



function newOffer(defaultOffer) {
    const dir = `../../src/data/affiliateNetworks/${defaultOffer.affiliateNetwork.fileName}`;
    if (!fs.existsSync(dir)) return;

    const offersDir = `${dir}/offers`;
    if (!fs.existsSync(offersDir)) fs.mkdirSync(offersDir);

    const path = `${offersDir}/${defaultOffer.fileName}`;
    fs.writeFileSync(path, JSON.stringify(defaultOffer, null, 4));

    console.log(`New offer created at ${path}`);
}
