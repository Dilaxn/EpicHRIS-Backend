const {Immigration} = require('../models/immigration');
const {Employee} = require('../models/employee');
const {CustomField} = require('../models/custom_field');

const addAnImmigrationRecord = async (req, res, emp_id) => {
    try {
        const keys = Object.keys(req.body);
        const allowedCustomKeys = await CustomField.getCustomFieldsName('immigration');
        const allowedKeys = ['document', 'issued_by', 'number', 'issued_date', 'expiry_date',
            'eligible_status', 'eligible_review_date', 'comment', ...allowedCustomKeys];

        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        });

        if (!isValidOperation || keys.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const customKeys = keys.filter((key) => {
            return allowedCustomKeys.includes(key);
        });

        const defaultKeys = keys.filter((key) => {
            return !customKeys.includes(key);
        })

        let immigrationObj = {};
        if (defaultKeys.length > 0) {
            defaultKeys.forEach((defaultKey) => {
                immigrationObj[defaultKey] = req.body[defaultKey];
            })
        }

        if (customKeys.length > 0) {
            immigrationObj.custom_fields = {};
            for (const customKey of customKeys) {
                immigrationObj.custom_fields[customKey] = await CustomField.validateAField('immigration', customKey, req.body[customKey]);
            }

        }

        const immigration = new Immigration({
            ...immigrationObj,
            employee: emp_id
        })

        if (!immigration) {
            res.status(400).send({message: 'could not create'});
            return;
        }

        await immigration.save();
        await immigration.populate({
            path: 'issued_by',
            select: 'name'
        }).execPopulate();
        const final = immigration.toObject();
        delete final.__v;
        delete final.id;
        res.status(201).send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const addAnImmigrationRecordForMe = async (req, res) => {
    await addAnImmigrationRecord(req, res, req.user.employee);
}

const addAnImmigrationRecordForAnEmployee = async (req, res) => {
    await addAnImmigrationRecord(req, res, req.params.emp_id);
}

const readAnImmigrationRecord = async (req, res, emp_id) => {
    try {
        const immigration = await Immigration.findOne({_id: req.params.immigration_id, employee: emp_id}).populate({
            path: 'issued_by',
            select: 'name'
        }).select('-__v');

        if (!immigration) {
            res.status(404).send({message: 'could not found'})
            return;
        }
        const final = immigration.toObject();
        delete final.id;
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readAnImmigrationRecordForMe = async (req, res) => {
    await readAnImmigrationRecord(req, res, req.user.employee);
}

const readAnImmigrationRecordForAnEmployee = async (req, res) => {
    await readAnImmigrationRecord(req, res, req.params.emp_id);
}

const readAllImmigrationRecords = async (req, res, emp_id) => {
    try {
        const employee = await Employee.findById(emp_id).populate({
            path: 'immigrations',
            select: '-__v',
            populate: {
                path: 'issued_by',
                select: 'name'
            }
        }).select('immigrations');

        if (!employee || employee.immigrations.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }

        let final = {};
        final.employee_id = employee._id;
        final.immigrations = [];
        employee.immigrations.forEach((immigration) => {
            const obj = immigration.toObject();
            delete obj.id;
            delete obj.employee;
            final.immigrations.push(obj);
        });

        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readMyAllImmigrationRecords = async (req, res) => {
    await readAllImmigrationRecords(req, res, req.user.employee);
}

const readAllImmigrationRecordsOfAnEmployee = async (req, res) => {
    await readAllImmigrationRecords(req, res, req.params.emp_id);
}

const updateAnImmigrationRecord = async (req, res, emp_id) => {
    try {
        const updates = Object.keys(req.body);
        const allowedCustomUpdates = await CustomField.getCustomFieldsName('immigration');
        const allowedKeys = ['document', 'number', 'issued_date', 'expiry_date', 'eligible_status',
            'issued_by', 'eligible_review_date', 'comment', ...allowedCustomUpdates];

        const isValidOperation = updates.every((update) => {
            return allowedKeys.includes(update);
        });

        if (!isValidOperation) {
            res.status(400).send({message: 'could not update'});
            return;
        }


        const immigration = await Immigration.findOne({_id: req.params.immigration_id, employee: emp_id});
        if (!immigration) {
            res.status(404).send({message: 'immigration not found'});
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
                immigration[defaultUpdate] = req.body[defaultUpdate];
            });
        }

        if (customUpdates.length > 0) {
            if (!immigration.custom_fields) {
                let customFieldsObj = {};
                for (const customUpdate of customUpdates) {
                    customFieldsObj[customUpdate] = await CustomField.validateAField('immigration', customUpdate, req.body[customUpdate]);
                }

                immigration.custom_fields = customFieldsObj;
            } else {
                for (const customUpdate of customUpdates) {
                    immigration.custom_fields[customUpdate] = await CustomField.validateAField('immigration', customUpdate, req.body[customUpdate]);
                }
            }

            immigration.markModified('custom_fields');
        }


        await immigration.save();
        await immigration.populate({
            path: 'issued_by',
            select: 'name'
        }).execPopulate();

        const final = immigration.toObject();
        delete final.__v;
        delete final.id;
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const updateAnImmigrationRecordOfMine = async (req, res) => {
    await updateAnImmigrationRecord(req, res, req.user.employee);
}


const updateAnImmigrationOfAnEmployee = async (req, res) => {
    await updateAnImmigrationRecord(req, res, req.params.emp_id);
}

const deleteMultipleImmigrations = async (req, res, emp_id) => {
    try {
        const immigrations = req.body.immigrations;

        if (!immigrations || !Array.isArray(immigrations) || immigrations.length === 0) {
            res.status(400).send({message: 'could not deleted'});
            return;
        }

        let final = [];

        for (const immigration of immigrations) {
            const deleted = await Immigration.findOneAndDelete({_id: immigration, employee: emp_id}).populate({
                path: 'issued_by',
                select: 'name'
            });
            if (deleted) {
                const obj = deleted.toObject();
                delete obj.__v;
                delete obj.id;
                final.push(obj);
            }
        }

        if (final.length === 0) {
            res.status(404).send({message: 'could not delete'});
            return;
        }

        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const deleteMultipleImmigrationRecordsOfMine = async (req, res) => {
    await deleteMultipleImmigrations(req, res, req.user.employee);
}

const deleteMultipleImmigrationRecordsOfAnEmployee = async (req, res) => {
    await deleteMultipleImmigrations(req, res, req.params.emp_id);
}

module.exports = {
    addAnImmigrationRecordForMe,
    addAnImmigrationRecordForAnEmployee,
    readAnImmigrationRecordForMe,
    readAnImmigrationRecordForAnEmployee,
    readMyAllImmigrationRecords,
    readAllImmigrationRecordsOfAnEmployee,
    updateAnImmigrationRecordOfMine,
    updateAnImmigrationOfAnEmployee,
    deleteMultipleImmigrationRecordsOfMine,
    deleteMultipleImmigrationRecordsOfAnEmployee
}