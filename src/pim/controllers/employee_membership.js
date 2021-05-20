const {EmployeeMembership} = require('../models/employee-membership');
const {Employee} = require('../models/employee');
const {CustomField} = require('../models/custom_field');


const addAMembership = async (req, res, emp_id) => {
    try {
        const keys = Object.keys(req.body);
        const allowedCustomKeys = await CustomField.getCustomFieldsName('membership');
        const allowedKeys = ['membership', 'subscription_paid_by', 'subscription_amount', 'currency', 'commence_date',
            'renewal_date', ...allowedCustomKeys];
        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        })
        if (!isValidOperation || keys.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const exist = await EmployeeMembership.findOne({employee: emp_id, membership: req.body.membership});
        if (exist) {
            res.status(400).send({message: 'membership already added'});
            return;
        }

        const customKeys = keys.filter((key) => {
            return allowedCustomKeys.includes(key);
        })

        const defaultKeys = keys.filter((key) => {
            return !customKeys.includes(key);
        });

        let membershipObj = {};
        if (defaultKeys.length > 0) {
            defaultKeys.forEach((defaultKey) => {
                membershipObj[defaultKey] = req.body[defaultKey];
            })
        }
        if (customKeys.length > 0) {
            membershipObj.custom_fields = {};
            for (const customKey of customKeys) {
                membershipObj.custom_fields[customKey] = await CustomField.validateAField('membership', customKey, req.body[customKey]);
            }
        }

        const membership = new EmployeeMembership({
            ...membershipObj,
            employee: emp_id
        });

        if (!membership) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await membership.save();
        await membership.populate({
            path: 'membership',
            select: '-__v'
        }).populate({
            path: 'currency',
            select: 'code currency'
        }).execPopulate();

        const final = membership.toObject();
        delete final.__v;
        delete final.id;
        res.status(201).send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}
const addMyMembership = async (req, res) => {
    await addAMembership(req, res, req.user.employee);
}

const addAMembershipToAnEmployee = async (req, res) => {
    await addAMembership(req, res, req.params.emp_id);
}

const readAMembership = async (req, res, emp_id) => {
    try {
        const membership = await EmployeeMembership.findOne({employee: emp_id, _id: req.params.id}).populate({
            path: 'membership',
            select: '-__v'
        }).populate({
            path: 'currency',
            select: 'code currency'
        }).select('-__v');
        if (!membership) {
            res.status(404).send({message: 'not found'});
            return;
        }

        const final = membership.toObject();
        delete final.id;
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readMyMembership = async (req, res) => {
    await readAMembership(req, res, req.user.employee);
}

const readAMembershipOfAnEmployee = async (req, res) => {
    await readAMembership(req, res, req.params.emp_id);
}

const readAllMemberships = async (req, res, emp_id) => {
    try {
        const employee = await Employee.findById(emp_id).populate({
            path: 'memberships',
            select: '-__v',
            populate: {
                path: 'membership currency',
                select: 'name code currency'
            }
        }).select('memberships');

        if (!employee || !employee.memberships || employee.memberships.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }
        const final = employee.toObject();
        delete final.id;
        final.memberships.forEach((membership) => {
            delete membership.id;
            delete membership.employee;
        })
        res.send(final);

    } catch (e) {
        res.status(500).send(e);
    }
}

const readAllMyMemberships = async (req, res) => {
    await readAllMemberships(req, res, req.user.employee);
}

const readAllMembershipsOfAnEmployee = async (req, res) => {
    await readAllMemberships(req, res, req.params.emp_id);
}

const updateAMembership = async (req, res, emp_id) => {
    try {
        const updates = Object.keys(req.body);
        const allowedCustomUpdates = await CustomField.getCustomFieldsName('membership');
        const allowedKeys = ['subscription_paid_by', 'subscription_amount', 'currency', 'commence_date',
            'renewal_date', ...allowedCustomUpdates];
        const isValidOperation = updates.every((update) => {
            return allowedKeys.includes(update);
        });

        if (!isValidOperation) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const membership = await EmployeeMembership.findOne({employee: emp_id, _id: req.params.id});
        if (!membership) {
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
                membership[defaultUpdate] = req.body[defaultUpdate];
            })
        }

        if (customUpdates.length > 0) {
            if (!membership.custom_fields) {
                membership.custom_fields = {};
                for (const customUpdate of customUpdates) {
                    membership.custom_fields[customUpdate] = await CustomField.validateAField('membership', customUpdate, req.body[customUpdate]);
                }
            }else {
                for (const customUpdate of customUpdates) {
                    membership.custom_fields[customUpdate] = await CustomField.validateAField('membership', customUpdate, req.body[customUpdate]);
                }
            }
            membership.markModified('custom_fields');
        }

        await membership.save();
        await membership.populate({
            path: 'membership',
            select: '-__v'
        }).populate({
            path: 'currency',
            select: 'code currency'
        }).execPopulate();

        const final = membership.toObject();
        delete final.id;
        delete final.__v;
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const updateMyMembership = async (req, res) => {
    await updateAMembership(req, res, req.user.employee);
}

const updateAMembershipOfAnEmployee = async (req, res) => {
    await updateAMembership(req, res, req.params.emp_id);
}

const deleteMembeships = async (req, res, emp_id) => {
    try {
        const ids = req.body.memberships;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const response = [];
        for (const id of ids) {
            const employeeMembership = await EmployeeMembership.findOne({employee: emp_id, _id: id}).select('-__v');
            if (employeeMembership) {
                await employeeMembership.remove();
                const obj = employeeMembership.toObject();
                delete obj.id;
                response.push(obj);
            }
        }

        if (response.length === 0) {
            res.status(404).send({message: 'none deleted'});
            return;
        }

        res.send(response);
    } catch (e) {
        res.status(500).send(e);
    }
}

const deleteMyMemberships = async (req, res) => {
    await deleteMembeships(req, res, req.user.employee);
}

const deleteMembershipsOfAnEmployee = async (req, res) => {
    await deleteMembeships(req, res, req.params.emp_id);
}


module.exports = {
    addMyMembership,
    addAMembershipToAnEmployee,
    readMyMembership,
    readAMembershipOfAnEmployee,
    readAllMyMemberships,
    readAllMembershipsOfAnEmployee,
    updateMyMembership,
    updateAMembershipOfAnEmployee,
    deleteMyMemberships,
    deleteMembershipsOfAnEmployee
}