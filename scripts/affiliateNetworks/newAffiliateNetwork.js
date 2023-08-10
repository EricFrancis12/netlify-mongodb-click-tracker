const crypto = require('crypto');
const fs = require('fs');

const inquirer = require('inquirer');

const utils = require('../../src/utils/utils');



const questions1 = [
    {
        type: 'input',
        name: 'affiliateNetworkName',
        message: 'Enter affiliate network name:'
    },
    {
        type: 'input',
        name: 'defaultNewOfferString',
        message: 'Enter default offer string (the part of the URL where we pass our click_id. leave blank to use replaceable template)'
    }
];



inquirer
    .prompt(questions1)
    .then((answers1) => {

        const _id = crypto.randomUUID();
        const timestamp = Date.now();
        const timestampFormatted = utils.formatTime(timestamp);
        const fileName = `${utils.camelCase(answers1.affiliateNetworkName)}.json`;

        let defaultNewOfferString;
        !answers1.defaultNewOfferString ? defaultNewOfferString = '&REPLACE={click_id}' : defaultNewOfferString = answers1.defaultNewOfferString;

        const defaultAffiliateNetwork = {
            _id,
            timestamp,
            timestampFormatted,
            name: answers1.affiliateNetworkName,
            fileName,
            defaultNewOfferString
        };
        newAffiliateNetwork(defaultAffiliateNetwork);
    })
    .catch((err) => {
        console.error('Error occurred:', err);
    });



function newAffiliateNetwork(defaultAffiliateNetwork) {
    const dir = `../../src/data/affiliateNetworks/${defaultAffiliateNetwork.fileName}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    const offersDir = `${dir}/offers`;
    if (!fs.existsSync(offersDir)) fs.mkdirSync(offersDir);

    const path = `${dir}/${defaultAffiliateNetwork.fileName}`;
    fs.writeFileSync(path, JSON.stringify(defaultAffiliateNetwork, null, 4));

    console.log(`New affiliate network created at ${path}`);
}
