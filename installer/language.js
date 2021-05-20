const fs = require('fs');
const path = require('path');

const {Language} = require('../src/admin/models/language');

const dataPath = path.join(__dirname, '../src/admin/data');

const loadLanguagesToDatabase = async () => {
    const languages = await Language.find({});

    if (!languages || languages.length === 0) {
        const bufferData = fs.readFileSync(dataPath + '/language.json');
        const jsonData = bufferData.toString();
        const data = JSON.parse(jsonData);

        const inserted = await Language.insertMany(data);
        if (!inserted || inserted.length === 0) {
            console.log('No languages inserted');
            return;
        }

        console.log('successfully inserted languages');
        return;
    }

    console.log('language is already in the database');
}

module.exports = {
    loadLanguagesToDatabase
}