const fs = require('fs');
const path = require('path');

const {OrganizationUnit} = require('../src/admin/models/organization_unit');

const dataPath = path.join(__dirname, '../src/admin/data');

const loadOrganizationUnitToDB = async () => {
    const organization = await OrganizationUnit.find({});

    if (!organization || organization.length === 0) {
        const organizationBuffer = fs.readFileSync(dataPath + '/organization_unit.json');
        const organizationJSON = organizationBuffer.toString();
        const organization = JSON.parse(organizationJSON);

        const parent = new OrganizationUnit(organization);

        if (!parent) {
            console.log('could not load parent organization unit');
            return;
        }

        await parent.save();
        console.log('successfully created top parent organization document');
        return;
    }

    console.log('parent organization is already exist');
}

module.exports = {
    loadOrganizationUnitToDB
}