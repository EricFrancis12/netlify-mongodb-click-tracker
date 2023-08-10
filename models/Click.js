const mongoose = require('mongoose');



const Click = new mongoose.Schema({
    timestamp: Number,
    click_id: {
        type: String,
        required: true
    },
    offerClicked: {
        type: Boolean,
        default: false
    },
    conversion: {
        type: Boolean,
        default: false
    },
    conversionTimestamp: {
        type: Number 
    },
    revenue: {
        type: Number,
        default: 0
    },
    cost: {
        type: Number,
        default: 0
    },
    tokens: {
        type: Array,
        default: []
    },
    flow: {
        type: Array,
        default: []
    },
    campaign: {
        _id: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        fileName: {
            type: String,
            default: ''
        },
    },
    trafficSource: {
        _id: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        fileName: {
            type: String,
            default: ''
        },
    },
    landingPage: {
        _id: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        fileName: {
            type: String,
            default: ''
        },
    },
    offer: {},
    url: {
        type: String,
        default: ''
    },
    ip: {
        type: String,
        default: ''
    },
    userAgent: {
        type: String,
        default: ''
    },
});



Click.pre('save', function (next) {
    this.dateLastUpdated = Date.now();
    next();
});



module.exports = mongoose.model('Click', Click);