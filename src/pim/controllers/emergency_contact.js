const {EmergencyContact} = require('../models/emergency_contact');
const {Employee} = require('../models/employee');
const {CustomField} = require('../models/custom_field');


const addEmergeContact = async (req, res, employee_id) => {
    try {
        const keys = Object.keys(req.body);
        const allowedCustomKeys = await CustomField.getCustomFieldsName('emergency_contact');
        const allowedKeys = ['name', 'relationship', 'home_tel', 'mobile', 'work_tel', ...allowedCustomKeys];
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
        });

        let emergencyContactObj = {};
        if (defaultKeys.length > 0) {
            defaultKeys.forEach((defaultKey) => {
                emergencyContactObj[defaultKey] = req.body[defaultKey];
            });
        }
        if (customKeys.length > 0) {
            emergencyContactObj.custom_fields = {}
            for (const customKey of customKeys) {
                emergencyContactObj.custom_fields[customKey] = await CustomField.validateAField('emergency_contact', customKey, req.body[customKey]);
            }
        }

        const emerge_contact = new EmergencyContact({
            ...emergencyContactObj,
            employee: employee_id
        })
        await emerge_contact.save();

        if (!emerge_contact) {
            res.status(400).send({message: 'could not add Emergency contact'});
            return;
        }
        const final = emerge_contact.toObject();
        delete final.__v;
        delete final.id;
        res.status(201).send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}
const addMyEmergencyContact = async (req, res) => {
    await addEmergeContact(req, res, req.user.employee);
}

const addAnEmergencyContact = async (req, res) => {

    await addEmergeContact(req, res, req.params.emp_id);
}

const updateEmergeContact = async (req, res, emp_id, id) => {
    try {
        const updates = Object.keys(req.body);
        const allowedCustomKeys = await CustomField.getCustomFieldsName('emergency_contact');
        const allowedKeys = ['name', 'relationship', 'home_tel', 'mobile', 'work_tel', ...allowedCustomKeys];
        const isValidOperation = updates.every((update) => {
            return allowedKeys.includes(update);
        })

        if (!isValidOperation) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const emergencyContact = await EmergencyContact.findOne({_id: id, employee: emp_id});
        if (!emergencyContact) {
            res.status(404).send({message: 'emergency contact not found'});
            return;
        }
        const customUpdates = updates.filter((update) => {
            return allowedCustomKeys.includes(update);
        })

        const defaultUpdates = updates.filter((update) => {
            return !customUpdates.includes(update);
        })
        if (defaultUpdates.length > 0) {
            defaultUpdates.forEach((defaultUpdate) => {
                emergencyContact[defaultUpdate] = req.body[defaultUpdate];
            })
        }

        if (customUpdates.length > 0) {
            if (!emergencyContact.custom_fields) {
                let customFieldsObj = {};
                for (const customUpdate of customUpdates) {
                    customFieldsObj[customUpdate] = await CustomField.validateAField('emergency_contact', customUpdate, req.body[customUpdate]);
                }

                emergencyContact.custom_fields = customFieldsObj;
            } else {
                for (const customUpdate of customUpdates) {
                    emergencyContact.custom_fields[customUpdate] = await CustomField.validateAField('emergency_contact', customUpdate, req.body[customUpdate]);
                }
            }
            emergencyContact.markModified('custom_fields');
        }


        await emergencyContact.save();
        const final = emergencyContact.toObject();
        delete final.__v;
        delete final.id;
        res.send(final);

    } catch (e) {
        res.status(500).send(e);
    }
}

const updateMyEmergencyContact = async (req, res) => {
    await updateEmergeContact(req, res, req.user.employee, req.params.id);
}

const updateAnEmergencyContact = async (req, res) => {
    await updateEmergeContact(req, res, req.params.emp_id, req.params.id);
}

const readEmergeContact = async (req, res, emp_id) => {
    try {

        const emergencyContact = await EmergencyContact.findOne({_id: req.params.id, employee: emp_id}).select('-__v');
        if (!emergencyContact) {
            res.status(404).send({message: 'emergency contact not found'});
        } else {
            const final = emergencyContact.toObject();
            delete final.id;
            res.send(final);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}
const readMyEmergencyContact = async (req, res) => {
    await readEmergeContact(req, res, req.user.employee);
}

const readAnEmergencyContact = async (req, res) => {

    await readEmergeContact(req, res, req.params.emp_id);
}

const deleteMyEmergencyContact = async (req, res) => {
    try {
        const emergencyContact = await EmergencyContact.findOneAndDelete({
            _id: req.params.id,
            employee: req.user.employee
        }).select('-__v');
        if (!emergencyContact) {
            res.status(404).send({message: 'could not found'});
        } else {
            const final = emergencyContact.toObject();
            delete final.id;
            res.send(final);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

const deleteMultipleEmergeContacts = async (req, res, emp_id) => {
    const emerge_ids = req.body.emerge_ids;

    try {
        const emergencyContacts = [];
        for (const id of emerge_ids) {
            const eContact = await EmergencyContact.findOneAndDelete({_id: id, employee: emp_id});
            if (eContact) {
                const deleted = eContact.toObject();
                delete deleted.__v;
                delete deleted.id;
                emergencyContacts.push(deleted);
            }
        }

        if (emergencyContacts.length === 0) {
            res.status(400).send({message: 'no emergency contacts deleted'});
        } else {
            res.send({emergencyContacts});
        }
    } catch (e) {
        res.status(500).send(e);
    }
}
const deleteMyMultiEmergencyContacts = async (req, res) => {
    await deleteMultipleEmergeContacts(req, res, req.user.employee);
}

const deleteMultiEmergencyContacts = async (req, res) => {
    await deleteMultipleEmergeContacts(req, res, req.params.emp_id);
}

const deleteAllEmergeForAnEmp = async (req, res, emp_id) => {
    try {
        const emergencyContacts = await EmergencyContact.deleteMany({employee: emp_id});

        if (!emergencyContacts) {
            res.status(404).send({message: 'none deleted'});
        } else {
            res.send(emergencyContacts);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

const deleteMyAllEmergencyContacts = async (req, res) => {
    await deleteAllEmergeForAnEmp(req, res, req.user.employee);
}

const deleteAllEmergencyContactsForAnEmployee = async (req, res) => {
    await deleteAllEmergeForAnEmp(req, res, req.params.emp_id);
}

const readMyAllEmergencyContacts = async (req, res) => {
    try {
        const emergencyContacts = await EmergencyContact.find({employee: req.user.employee}).select('-__v');
        if (!emergencyContacts || emergencyContacts.length === 0) {
            res.status(404).send({message: 'not found emergency contacts'});
        } else {
            const final = [];
            emergencyContacts.forEach((emContact) => {
                const obj = emContact.toObject();
                delete obj.id;
                final.push(obj);
            })

            if (final.length === 0) {
                res.status(404).send({message: 'not found'});
                return;
            }
            res.send(final);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

const readAllEmergencyContactsForAnEmployee = async (req, res) => {

    try {
        const employee = await Employee.findById(req.params.emp_id).populate({
            path: 'emergency_contacts',
            select: '-__v'
        }).select('emergency_contacts');
    // || employee.emergency_contacts.length === 0
        if (!employee ) {
            res.status(404).send({message: 'emergency contacts not found'});
        } else {

            const final = {};
            final.employee_id = employee._id;
            final.emergency_contacts = [];
            employee.emergency_contacts.forEach((emc) => {
                const obj = emc.toObject();
                delete obj.id;
                delete obj.employee;
                final.emergency_contacts.push(obj);
            })
            res.send(final);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}


module.exports = {
    addMyEmergencyContact,
    updateMyEmergencyContact,
    readMyEmergencyContact,
    deleteMyEmergencyContact,
    deleteMyMultiEmergencyContacts,
    readMyAllEmergencyContacts,
    addAnEmergencyContact,
    updateAnEmergencyContact,
    readAnEmergencyContact,
    deleteMultiEmergencyContacts,
    deleteMyAllEmergencyContacts,
    deleteAllEmergencyContactsForAnEmployee,
    readAllEmergencyContactsForAnEmployee
}