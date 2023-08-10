const crypto = require('crypto');
const fs = require('fs');

const inquirer = require('inquirer');

const utils = require('../../src/utils/utils');



const questions1 = [
    {
        type: 'input',
        name: 'landingPageName',
        message: 'Enter landing page name (leave blank to use URL as name):'
    },
    {
        type: 'input',
        name: 'landingPageUrl',
        message: 'Enter landing page URL:'
    }
];



inquirer
    .prompt(questions1)
    .then((answers1) => {

        const _id = crypto.randomUUID();
        const timestamp = Date.now();
        const timestampFormatted = utils.formatTime(timestamp);

        let name;
        answers1.landingPageName
            ? name = answers1.landingPageName
            : name = answers1.landingPageUrl;

        const fileName = `${utils.camelCase(name.split('?')[0])}.json`;

        const defaultLandingPage = {
            _id,
            timestamp,
            timestampFormatted,
            name,
            fileName,
            url: answers1.landingPageUrl
        };
        newLandingPage(defaultLandingPage);
    })
    .catch((err) => {
        console.error('Error occurred:', err);
    });



function newLandingPage(defaultLandingPage) {
    const path = `../../src/data/landingPages/${defaultLandingPage.fileName}`;
    fs.writeFileSync(path, JSON.stringify(defaultLandingPage, null, 4));

    console.log(`New landing page created at ${path}`);
}
