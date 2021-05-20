const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    number: {
        type: String
    },
    digits: {
        type: Number
    },
    currency: {
        type: String
    },
    countries: [{
        type: String
    }]

});

const Currency = mongoose.model('Currency', currencySchema);
module.exports = {
    currencySchema,
    Currency
}