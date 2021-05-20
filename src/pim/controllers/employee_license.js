const {EmployeeLicense} = require('../models/employee_license');
const {Employee} = require('../models/employee');
const {CustomField} = require('../models/custom_field');


const addALicense = async (req, res, emp_id) => {
    try {
        const keys = Object.keys(req.body);
        const allowedCustomKeys = await CustomField.getCustomFieldsName('license');
        const allowedKeys = ['license_type', 'license_number', 'issued_date', 'expiry_date', ...allowedCustomKeys];
        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        })

        if (!isValidOperation) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const exist = await EmployeeLicense.findOne({employee: emp_id, license_type: req.body.license_type});
        if (exist) {
            res.status(400).send({message: 'this type of license already added'});
            return;
        }

        const customKeys = keys.filter((key) => {
            return allowedCustomKeys.includes(key);
        })

        const defaultKeys = keys.filter((key) => {
            return !customKeys.includes(key);
        })
        let licenseObj = {};
        if (defaultKeys.length > 0) {
            defaultKeys.forEach((defaultKey) => {
                licenseObj[defaultKey] = req.body[defaultKey];
            })
        }

        if (customKeys.length > 0) {
            licenseObj.custom_fields = {};
            for (const customKey of customKeys) {
                licenseObj.custom_fields[customKey] = await CustomField.validateAField('license', customKey, req.body[customKey]);
            }
        }

        const license = new EmployeeLicense({
            ...licenseObj,
            employee: emp_id
        });

        if (!license) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await license.save();
        await license.populate({
            path: 'license_type',
            select: '-__v'
        }).execPopulate();

        const final = license.toObject();
        delete final.id;
        delete final.__v;
        res.status(201).send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}
const addMyLicense = async (req, res) => {
    await addALicense(req, res, req.user.employee);
}

const addALicenseOfAnEmployee = async (req, res) => {
    await addALicense(req, res, req.params.emp_id);
}

const readALicense = async (req, res, emp_id) => {
    try {
        const license = await EmployeeLicense.findOne({employee: emp_id, _id: req.params.id}).populate({
            path: 'license_type',
            select: '-__v'
        }).select('-__v');

        if (!license) {
            res.status(404).send({message: 'not found'});
            return;
        }
        const final = license.toObject();
        delete final.id;
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readMyLicense = async (req, res) => {
    await readALicense(req, res, req.user.employee);
}

const readALicenseOfAnEmployee = async (req, res) => {
    await readALicense(req, res, req.params.emp_id);
}

const readAllLicenses = async (req, res, emp_id) => {
    try {
        const employee = await Employee.findById(emp_id).populate({
            path: 'licenses',
            select: '-__v',
            populate: {
                path: 'license_type',
                select: '-__v'
            }
        }).select('licenses');

        if (!employee || !employee.licenses) {
            res.status(404).send({message: 'licenses not found'});
            return;
        }

        const final = employee.toObject();
        delete final.id;
        final.licenses.forEach((license) => {
            delete license.id;
        })
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const getMyAllLicenses = async (req, res) => {
    await readAllLicenses(req, res, req.user.employee);
}

const readAllLicensesOfAnEmployee = async (req, res) => {
    await readAllLicenses(req, res, req.params.emp_id);
}

const updateALicense = async (req, res, emp_id) => {
    try {
        const updates = Object.keys(req.body);
        const allowedCustomUpdates = await CustomField.getCustomFieldsName('license');
        const allowedUpdates = ['license_number', 'issued_date', 'expiry_date', ...allowedCustomUpdates];
        const isValidOperation = updates.every((update) => {
            return allowedUpdates.includes(update);
        })

        if (!isValidOperation || updates.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const license = await EmployeeLicense.findOne({employee: emp_id, _id: req.params.id});
        if (!license) {
            res.status(404).send({message: 'not found'});
            return;
        }

        const customUpdates = updates.filter((update) => {
            return allowedCustomUpdates.includes(update);
        })

        const defaultUpdates = updates.filter((update) => {
            return !customUpdates.includes(update);
        })

        if (defaultUpdates.length > 0) {
            defaultUpdates.forEach((defaultUpdate) => {
                license[defaultUpdate] = req.body[defaultUpdate];
            })
        }

        if (customUpdates.length > 0) {
            if (!license.custom_fields) {
                license.custom_fields = {};
                for (const customUpdate of customUpdates) {
                    license.custom_fields[customUpdate] = await CustomField.validateAField('license', customUpdate, req.body[customUpdate]);
                }
            }else {
                for (const customUpdate of customUpdates) {
                    license.custom_fields[customUpdate] = await CustomField.validateAField('license', customUpdate, req.body[customUpdate]);
                }
            }
            license.markModified('custom_fields');
        }

        await license.save();
        await license.populate({
            path: 'license_type',
            select: '-__v'
        }).execPopulate();

        const final = license.toObject();
        delete final.id;
        delete final.__v;
        res.send(final);

    } catch (e) {
        res.status(500).send(e);
    }
}

const updateMyLicense = async (req, res) => {
    await updateALicense(req, res, req.user.employee);
}

const updateALicenseOfAnEmployee = async (req, res) => {
    await updateALicense(req, res, req.params.emp_id);
}

const deleteLicenses = async (req, res, emp_id) => {
    try {
        const ids = req.body.licenses;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const response = [];
        for (const id of ids) {
            const employeeLicense = await EmployeeLicense.findOne({employee: emp_id, _id: id}).select('-__v');
            if (employeeLicense) {
                await employeeLicense.remove();
                const licenseObj = employeeLicense.toObject();
                delete licenseObj.id;
                response.push(licenseObj);
            }
        }

        if (response.length === 0) {
            res.status(400).send({message: 'none deleted'});
            return;
        }

        res.send(response);
    } catch (e) {
        res.status(500).send(e);
    }
}

const deleteMyLicenses = async (req, res) => {
    await deleteLicenses(req, res, req.user.employee);
}

const deleteLicensesOfAnEmployee = async (req, res) => {
    await deleteLicenses(req, res, req.params.emp_id);
}


module.exports = {
    addMyLicense,
    addALicenseOfAnEmployee,
    readMyLicense,
    readALicenseOfAnEmployee,
    getMyAllLicenses,
    readAllLicensesOfAnEmployee,
    updateMyLicense,
    updateALicenseOfAnEmployee,
    deleteMyLicenses,
    deleteLicensesOfAnEmployee
}