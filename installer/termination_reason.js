const fs = require('fs');
const path = require('path');

const {TerminationReason} = require('../src/pim/models/termination_reason');
const employeeDataPath = path.join(__dirname, '../src/pim/data');

const loadTerminationReasonToDB = async () => {
    const terminationReasons = await TerminationReason.find({});

    if (!terminationReasons || terminationReasons.length < 1) {
        const buffer = fs.readFileSync(employeeDataPath + '/termination_reason.json');
        const jsonData = buffer.toString();
        const data = JSON.parse(jsonData);

        const updated = await TerminationReason.insertMany(data);

        if (!updated || updated.length === 0) {
            console.log('could not load initial data for termination reason');
            return;
        }

        console.log('termination reason data inserted successfully');
        return;
    }else {
        console.log('termination reason data already exist');
    }
}

module.exports = {
    loadTerminationReasonToDB
}