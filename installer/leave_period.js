const {LeavePeriod} = require('../src/leave/models/leave_period');
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../src/leave/data');

const setLeavePeriodDefaultConf = async () => {
    const existingConfig = await LeavePeriod.findOne({});
    if (!existingConfig) {
        const buffer = fs.readFileSync(dataPath + '/leave_period.json');
        const configJson = buffer.toString();
        const configObj = JSON.parse(configJson);

        const leavePeriod = new LeavePeriod({
            ...configObj
        });
        await leavePeriod.save();
        console.log('leave period configuration set to default');
        return;
    }

    console.log('leave period already configured');
}

module.exports = {
    setLeavePeriodDefaultConf
}