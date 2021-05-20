const fs = require('fs');
const path = require('path');

const {LanguageCompetency} = require('../src/admin/models/language_competency');

const dataPath = path.join(__dirname, '../src/admin/data');

const insertLanguageCompetencies = async () => {
    const languageCompetencies = await LanguageCompetency.find({});

    if (!languageCompetencies || languageCompetencies.length === 0) {
        const bufferData = fs.readFileSync(dataPath + '/language_competency.json');
        const jsonData = bufferData.toString();
        const data = JSON.parse(jsonData);

        if (!data || data.length === 0) {
            console.log('could not find language competency data');
            return;
        }

        const inserted = await LanguageCompetency.insertMany(data);
        if (!inserted || inserted.length === 0) {
            console.log('could not insert language competency data');
            return;
        }

        console.log('successfully inserted language competency data');
        return;
    }

    console.log('language competency data is already exist in the database');
}

module.exports = {
    insertLanguageCompetencies
}