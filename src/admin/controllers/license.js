const {License} = require('../models/license');


const addALicenseType = async (req, res) => {
    try {
        const license = new License({
            ...req.body
        });

        if (!license) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await license.save();
        const final = license.toObject();
        delete final.__v;
        res.status(201).send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const readALicenseType = async (req, res) => {
    try {
        const license = await License.findById(req.params.id).select('-__v');
        if (!license) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(license);
    }catch (e) {
        res.status(500).send(e);
    }
}

const readAllLicenseTypes = async (req, res) => {
    try {
        const licenses = await License.find({}).select('-__v');
        if (!licenses || licenses.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(licenses);
    }catch (e) {
        res.status(500).send(e);
    }
}

const updateALicenseType = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedKeys = ['name'];
    const isValidOperation = updates.every((update) => {
        return allowedKeys.includes(update);
    });

    if (!isValidOperation || updates.length === 0) {
        res.status(400).send({message: 'invalid request'});
        return;
    }

    try {
        const license = await License.findById(req.params.id);
        if (!license) {
            res.status(404).send({message: 'license not found'});
            return;
        }

        updates.forEach((update) => {
            license[update] = req.body[update];
        })

        await license.save();

        res.send(license);
    }catch (e) {
        res.status(500).send(e);
    }
}

const deleteLicenseTypes = async (req, res) => {
    try {
        const ids = req.body.licenses;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const response = [];

        for (const id of ids) {
            const license = await License.findById(id).select('-__v');
            if (license) {
                await license.remove();
                response.push(license);
            }
        }

        if (response.length === 0) {
            res.status(404).send({message: 'none deleted'});
            return;
        }

        res.send(response);

    }catch (e) {
        res.status(500).send(e);
    }
}


module.exports = {
    addALicenseType,
    readALicenseType,
    readAllLicenseTypes,
    updateALicenseType,
    deleteLicenseTypes
}