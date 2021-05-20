const {Dependent} = require('../models/dependent');
const {Employee} = require('../models/employee');
const {CustomField} = require('../models/custom_field');


const addDependent = async (req, res, emp_id) => {
    try {
        const keys = Object.keys(req.body);
        const allowedCustomKeys = await CustomField.getCustomFieldsName('dependent');
        const allowedKeys = ['name', 'relationship', 'date_of_birth', ...allowedCustomKeys];
        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        })

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
        let dependentObj = {};
        if (defaultKeys.length > 0) {
            defaultKeys.forEach((defaultKey) => {
                dependentObj[defaultKey] = req.body[defaultKey];
            })
        }

        if (customKeys.length > 0) {
            dependentObj.custom_fields = {};
            for (const customKey of customKeys) {
                dependentObj.custom_fields[customKey] = await CustomField.validateAField('dependent', customKey, req.body[customKey]);
            }
        }
        const dependent = new Dependent({
            ...dependentObj,
            employee: emp_id
        })

        if (!dependent) {
            res.status(400).send({message: 'invalid request'});
        } else {
            await dependent.save();
            const final = dependent.toObject();
            delete final.id;
            delete final.__v;
            res.status(201).send(final);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}
const addMyDependent = async (req, res) => {
    await addDependent(req, res, req.user.employee);
}

const addADependentForAnEmployee = async (req, res) => {
    await addDependent(req, res, req.params.emp_id);
}


const readADependent = async (req, res, emp_id) => {
    try {
        const dependent = await Dependent.findOne({employee: emp_id, _id: req.params.dep_id}).select('-__v');

        if (!dependent) {
            res.status(404).send({message: 'could not found'});
        } else {
            const final = dependent.toObject();
            delete final.id;
            res.send(final);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}
const readMyDependent = async (req, res) => {
    await readADependent(req, res, req.user.employee);
}

const readADependentForAnEmployee = async (req, res) => {
    await readADependent(req, res, req.params.emp_id);
}

const readAllDependents = async (req, res, emp_id) => {
    try {
        const employee = await Employee.findById(emp_id).populate({
            path: 'dependents',
            select: '-__v'
        }).select('dependents');

        if (!employee || employee.dependents.length === 0) {
            res.status(404).send({message: 'could not found'});
        } else {
            let final = {};
            final.employee_id = employee._id;
            final.dependents = [];
            employee.dependents.forEach((dependent) => {
                const obj = dependent.toObject();
                delete obj.id;
                final.dependents.push(obj);
            })
            res.send(final);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

const readMyAllDependents = async (req, res) => {
    await readAllDependents(req, res, req.user.employee);
}

const readAllDependentsForAnEmployee = async (req, res) => {
    await readAllDependents(req, res, req.params.emp_id);
}

const updateADependent = async (req, res, emp_id) => {
    try {
        const updates = Object.keys(req.body);
        const allowedCustomUpdates = await CustomField.getCustomFieldsName('dependent');
        const allowedKeys = ['name', 'relationship', 'date_of_birth', ...allowedCustomUpdates];

        const isValidOperation = updates.every((update) => {
            return allowedKeys.includes(update);
        });

        if (!isValidOperation || updates.length === 0) {
            res.status(400).send({message: 'could not update'});
            return;
        }

        const dependent = await Dependent.findOne({_id: req.params.dep_id, employee: emp_id});
        if (!dependent) {
            res.status(404).send({message: 'could not found'});
        } else {
            const customUpdates = updates.filter((update) => {
                return allowedCustomUpdates.includes(update);
            })

            const defaultUpdates = updates.filter((update) => {
                return !customUpdates.includes(update);
            })
            if (defaultUpdates.length > 0) {
                defaultUpdates.forEach((defaultUpdate) => {
                    dependent[defaultUpdate] = req.body[defaultUpdate];
                })
            }

            if (customUpdates.length > 0) {
                if (!dependent.custom_fields) {
                    let customFieldObj = {};
                    for (const customUpdate of customUpdates) {
                        customFieldObj[customUpdate] = await CustomField.validateAField('dependent', customUpdate, req.body[customUpdate]);
                    }

                    dependent.custom_fields = customFieldObj;
                } else {
                    for (const customUpdate of customUpdates) {
                        dependent.custom_fields[customUpdate] = await CustomField.validateAField('dependent', customUpdate, req.body[customUpdate]);
                    }
                }

                dependent.markModified('custom_fields');
            }


            await dependent.save();
            const final = dependent.toObject();
            delete final.id;
            delete final.__v;
            res.send(final);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}
const updateMyDependent = async (req, res) => {
    await updateADependent(req, res, req.user.employee);
}

const updateADependentOfAnEmployee = async (req, res) => {
    await updateADependent(req, res, req.params.emp_id);
}

const deleteADependent = async (req, res, emp_id) => {
    try {
        const dependent = await Dependent.findOneAndDelete({_id: req.params.dep_id, employee: emp_id}).select('-__v');
        if (!dependent) {
            res.status('400').send({message: 'could not delete'});
            return;
        }
        const final = dependent.toObject();
        delete final.id;
        res.send(final);

    } catch (e) {
        res.status(500).send(e);
    }
}

const deleteMyDependent = async (req, res) => {
    await deleteADependent(req, res, req.user.employee);
}

const deleteADependantOfAnEmployee = async (req, res) => {
    await deleteADependent(req, res, req.params.emp_id);
}

const deleteMultipleDep = async (req, res, emp_id) => {
    try {
        const dependents = req.body.dependents;

        if (!dependents || !Array.isArray(dependents) || dependents.length === 0) {
            res.status(400).send({message: 'could not deleted'});
            return;
        }

        let count = [];

        for (const dependent of dependents) {
            const deleted = await Dependent.findOneAndDelete({_id: dependent, employee: emp_id}).select('-__v');
            if (deleted) {
                const obj = deleted.toObject();
                delete obj.id;
                count.push(obj);
            }
        }

        if (count.length === 0) {
            res.status(404).send({message: 'could not delete'});
            return;
        }

        res.send(count);
    } catch (e) {
        res.status(500).send(e);
    }
}

const deleteMyMultipleDependents = async (req, res) => {
    await deleteMultipleDep(req, res, req.user.employee);
}

const deleteMultipleDependentsOfAnEmployee = async (req, res) => {
    await deleteMultipleDep(req, res, req.params.emp_id);
}


module.exports = {
    addMyDependent,
    addADependentForAnEmployee,
    readMyDependent,
    readADependentForAnEmployee,
    readMyAllDependents,
    readAllDependentsForAnEmployee,
    updateMyDependent,
    updateADependentOfAnEmployee,
    deleteMyDependent,
    deleteADependantOfAnEmployee,
    deleteMyMultipleDependents,
    deleteMultipleDependentsOfAnEmployee
};