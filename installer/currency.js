const data = require('currency-codes/data');
const {Currency} = require('../src/admin/models/currency');

const loadCurrencyData = async () => {
    const currencies = await Currency.find({});

    if (!currencies || currencies.length === 0) {
        const inserted = await Currency.insertMany(data);

        if (!inserted || inserted.length === 0) {
            console.log('could not load currency data');
            return;
        }

        console.log('successfully inserted currency data');
    }else {
        console.log('currency data already in the data base');
    }
}

module.exports = {
    loadCurrencyData
}