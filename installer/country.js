const fs = require('fs');
const path = require('path');
const {Country} = require('../src/admin/models/country');

const dataPath = path.join(__dirname, '../src/admin/data');

const loadCountriesToDatabase = async () => {
    const countries = await Country.find({});

    if(!countries || countries.length === 0) {
        const countryBuffer = fs.readFileSync(dataPath + '/country.json');
        const countryJSON = countryBuffer.toString();
        const country = JSON.parse(countryJSON);

        const result = await Country.insertMany(country);
        if (!result || result.length === 0) {
            console.log('could not create country collection');
            return;
        }

        console.log('successfully created collection for countries');
    }else {
        console.log('database for countries already exist');
    }
}

module.exports = {loadCountriesToDatabase};