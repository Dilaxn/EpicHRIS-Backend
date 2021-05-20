const fs = require('fs');
const path = require('path');

const {WorkWeek} = require('../src/leave/models/work_week');
const dataPath = path.join(__dirname, '../src/leave/data');
const setupWorkWeekDefaultConf = async () => {
    const workWeek = await WorkWeek.findOne({});
    if (!workWeek) {
        const buffer = fs.readFileSync(dataPath + '/work_week.json');
        const configJson = buffer.toString();
        const obj = JSON.parse(configJson);

        const newWorkWeek = new WorkWeek({
            ...obj
        });
        await newWorkWeek.save();
        console.log('work week configuration set to default');
        return;
    }

    console.log('work week configuration already configured');
}

module.exports = {setupWorkWeekDefaultConf};