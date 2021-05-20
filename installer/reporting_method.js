const fs = require('fs');
const path = require('path');

const {ReportingMethod} = require('../src/pim/models/reporting_method');

const dataPath = path.join(__dirname, '../src/pim/data');

const insertReportingMethods = async () => {
    const reportingMethods = await ReportingMethod.find({});

    if (!reportingMethods || reportingMethods.length === 0) {
        const bufferData = fs.readFileSync(dataPath + '/reporting_method.json');
        const jsonData = bufferData.toString();
        const data = JSON.parse(jsonData);

        const inserted = await ReportingMethod.insertMany(data);
        if (!inserted || inserted.length === 0) {
            console.log('No reporting methods inserted');
            return;
        }

        console.log('successfully inserted reporting methods');
        return;
    }

    console.log('reporting methods are already exist in the database');
}

module.exports = {
    insertReportingMethods
}