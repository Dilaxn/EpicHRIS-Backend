const {Organization} = require('../models/organization');

const updateOrganizationGeneralInformation = async (req, res) => {
    console.log(req.body);
    try {
        const keys = Object.keys(req.body);
        const allowedKeys = ['organization_name', 'tax_id', 'registration_number', 'organization_phone',
        'organization_email', 'organization_fax', 'organization_street_1', 'organization_street_2',
        'organization_city', 'organization_province', 'country', 'organization_postal_code', 'organization_note'];
        const isValidOperation =  keys.every((key) => {
            return allowedKeys.includes(key);
        });

        if (!isValidOperation) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const organization = await Organization.findOne({}).select('-__v');
        if (organization) {
            for (const key of keys) {
                organization[key] = req.body[key];
            }

            await organization.save();
            await organization.populate({
                path: 'country',
                select: '-__v'
            }).execPopulate();
            res.send(organization);
            return;
        }

        const newOrganization = new Organization({
            ...req.body
        });
        await newOrganization.save();
        await newOrganization.populate({
            path: 'country',
            select: '-__v'
        }).execPopulate();
        const obj = newOrganization.toObject();
        delete newOrganization.__v;
        res.send(obj);
    }catch (e) {
        res.status(500).send({error: e.message});
    }
}

module.exports = {
    updateOrganizationGeneralInformation
}