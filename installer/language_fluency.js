const fs = require('fs');
const path = require('path');

const {LanguageFluency} = require('../src/admin/models/language_fluency');

const dataPath = path.join(__dirname, '../src/admin/data');

const insertLanguageFluencyIntoDatabase = async () => {
    const languageFluency = await LanguageFluency.find({});

    if (!languageFluency || languageFluency.length === 0) {
        const bufferData = fs.readFileSync(dataPath + '/language_fluency.json');
        const jsonData = bufferData.toString();
        const data = JSON.parse(jsonData);

        const inserted = await LanguageFluency.insertMany(data);
        if (!inserted || inserted.length === 0) {
            console.log('something wrong! no language fluency inserted');
            return;
        }

        console.log('successfully language fluency inserted');
        return;
    }

    console.log('language fluency already exist in the database');
}

module.exports = {
    insertLanguageFluencyIntoDatabase
}
