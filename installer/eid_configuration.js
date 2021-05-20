const fs = require('fs');
const path = require('path');

const {EidConfiguration} = require('../src/pim/models/eid_configuration');

const dataPath = path.join(__dirname, '../src/pim/data');

const insertDefaultEidConf = async () => {
    const eidConf = await EidConfiguration.findOne({});
    if (!eidConf) {
        const dataButter = fs.readFileSync(dataPath + '/eid_configuration.json');
        const dataJson = dataButter.toString();
        const data = JSON.parse(dataJson);

        if (!data) {
            console.log('default eid configuration data not found');
            return;
        }

        const defaultEidConf = new EidConfiguration(data);
        await defaultEidConf.save();
        console.log('successfully inserted default eid configuration');
        return;
    }

    console.log('already eid configured');
}

module.exports = {
    insertDefaultEidConf
}