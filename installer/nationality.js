const fs = require('fs');
const path = require('path');

const {Nationality} = require('../src/admin/models/nationality');

const dataPath = path.join(__dirname, '../src/admin/data');

const insertNationalities = async () => {
    const nationality = await Nationality.find({});

    if (!nationality || nationality.length === 0) {
        const bufferData = fs.readFileSync(dataPath + '/nationality.json');
        const jsonData = bufferData.toString();
        const data = JSON.parse(jsonData);

        const inserted = await Nationality.insertMany(data);
        if (!inserted || inserted.length === 0) {
            console.log('No nationalities inserted');
            return;
        }

        console.log('successfully inserted nationalities');
        return;
    }

    console.log('nationalities are already exist in the database');
}

module.exports = {
    insertNationalities
}