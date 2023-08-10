const fs = require('fs');
const path = require('path');



const DIR = {
    affiliateNetworks: path.join(__dirname, './affiliateNetworks/'),
    campaigns: path.join(__dirname, './campaigns/'),
    landingPages: path.join(__dirname, './landingPages/'),
    trafficSources: path.join(__dirname, './trafficSources/')
};



const affiliateNetworksDirContents = fs.readdirSync(DIR.affiliateNetworks);
const affiliateNetworks = affiliateNetworksDirContents.map(item => require(path.join(DIR.affiliateNetworks, item, `${item}.json`)));

const campaignsDirContents = fs.readdirSync(DIR.campaigns);
const campaigns = campaignsDirContents.map(item => require(path.join(DIR.campaigns, item)));

const landingPagesDirContents = fs.readdirSync(DIR.landingPages);
const landingPages = landingPagesDirContents.map(item => require(path.join(DIR.landingPages, item)));

const offers = affiliateNetworksDirContents.map(item => {
    const offers = fs.readdirSync(path.join(DIR.affiliateNetworks, item, 'offers'));
    const result = []
    offers.forEach(offer => {
        const offerJSON = require(path.join(DIR.affiliateNetworks, item, 'offers', offer));
        result.push(offerJSON);
    });

    return result;
}).flat();

const trafficSourcdesDirContents = fs.readdirSync(DIR.trafficSources);
const trafficSources = trafficSourcdesDirContents.map(item => require(path.join(DIR.trafficSources, item)));



const data = {
    affiliateNetworks,
    campaigns,
    landingPages,
    offers,
    trafficSources
};
console.log(data);

module.exports = data;