const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/pim/data');
const {PayFrequency} = require('../src/pim/models/pay_frequency');


const loadPayFrequenciesToDatabase = async () => {
    const payFrequencies = await PayFrequency.find({});

    if (!payFrequencies || payFrequencies.length === 0) {
        const bufferData = fs.readFileSync(dataPath + '/pay_frequency.json');
        const jsonData = bufferData.toString();
        const data = JSON.parse(jsonData);

        await PayFrequency.insertMany(data);
        console.log('successfully inserted pay frequencies to database');
        return;
    }

    console.log('pay frequencies already exist');
}

module.exports = {
    loadPayFrequenciesToDatabase
}