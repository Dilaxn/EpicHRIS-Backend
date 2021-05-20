const fs = require('fs');
const path = require('path');

const {PimConfiguration} = require('../src/pim/models/pim_configuration');

const dataPath = path.join(__dirname, '../src/pim/data');

const insertDefaultPimConfiguration = async () => {
    const pim_configuration = await PimConfiguration.findOne({});
    if (!pim_configuration) {
        const bufferData = fs.readFileSync(dataPath + '/pim_configuration.json');
        const jsonData = bufferData.toString();
        const data = JSON.parse(jsonData);

        const default_conf = new PimConfiguration(data);
        await default_conf.save();

        console.log('successfully inserted default pim configuration');
        return;
    }

    console.log('pim module already configured');
}

module.exports = {
    insertDefaultPimConfiguration
}