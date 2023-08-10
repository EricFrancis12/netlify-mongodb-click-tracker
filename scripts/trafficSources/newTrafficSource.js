const crypto = require('crypto');
const fs = require('fs');

const inquirer = require('inquirer');

const utils = require('../../src/utils/utils');



const questions1 = [
    {
        type: 'input',
        name: 'trafficSourceName',
        message: 'Enter traffic source name:'
    },
    {
        type: 'input',
        name: 'postbackUrl',
        message: 'Enter postback url:'
    },
    {
        type: 'input',
        name: 'externalIdTokenValue',
        message: 'Enter traffic source "External ID" token (include any and all brackets "{}", "[]", etc.):'
    },
    {
        type: 'input',
        name: 'costTokenValue',
        message: 'Enter traffic source "Cost" token (include any and all brackets "{}", "[]", etc.):'
    },
    {
        type: 'list',
        name: 'numAddlTokens',
        message: 'How many additional tokens do you want to track?',
        choices: ['Input later', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    },
];



inquirer
    .prompt(questions1)
    .then((answers1) => {

        const questions2 = [];
        if (answers1.numAddlTokens !== 'Input later') {
            for (let i = 1; i <= answers1.numAddlTokens; i++) {
                questions2.push({
                    type: 'input',
                    name: `customToken${i}Name`,
                    message: `Enter custom token ${i} name (as it will appear in your data columns):`
                });
                questions2.push({
                    type: 'input',
                    name: `customToken${i}Key`,
                    message: `Enter custom token ${i} key (this will become your tracking parameter):`
                });
                questions2.push({
                    type: 'input',
                    name: `customToken${i}Value`,
                    message: `Enter custom token ${i} value (from traffic source; include any and all brackets "{}", "[]", etc.):`
                });
            }
        }

        inquirer
            .prompt(questions2)
            .then((answers2) => {

                const _id = crypto.randomUUID();
                const timestamp = Date.now();
                const timestampFormatted = utils.formatTime(timestamp);
                const fileName = `${utils.camelCase(answers1.trafficSourceName)}.json`;

                const tokensArr = [
                    {
                        name: 'External ID',
                        key: 'externalId',
                        value: answers1.externalIdTokenValue
                    },
                    {
                        name: 'Cost',
                        key: 'cost',
                        value: answers1.costTokenValue
                    }
                ];
                for (let j = 1; j <= answers1.numAddlTokens; j++) {
                    const customToken = {
                        name: answers2[`customToken${j}Name`],
                        key: answers2[`customToken${j}Key`],
                        value: answers2[`customToken${j}Value`]
                    };
                    tokensArr.push(customToken);
                }

                const defaultTrafficSource = {
                    _id,
                    timestamp,
                    timestampFormatted,
                    name: answers1.trafficSourceName,
                    fileName,
                    postbackUrl: answers1.postbackUrl,
                    tokensArr
                };
                newTrafficSource(defaultTrafficSource);
            });
    })
    .catch((err) => {
        console.error('Error occurred:', err);
    });



function newTrafficSource(defaultTrafficSource) {
    const path = `../../src/data/trafficSources/${defaultTrafficSource.fileName}`;
    fs.writeFileSync(path, JSON.stringify(defaultTrafficSource, null, 4));

    console.log(`New traffic source created at ${path}`);
}
