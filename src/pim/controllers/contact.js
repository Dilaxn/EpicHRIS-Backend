const {Contact} = require('../models/contact');
const {Employee} = require('../models/employee');
const {CustomField} = require('../models/custom_field');

const updateEmployeeContact = async (req, res, emp_id) => {
    try {
        const keys = Object.keys(req.body);
        const allowedCustomKeys = await CustomField.getCustomFieldsName('contact');
        const allowedKeys = ['street1', 'street2', 'city', 'province', 'postal_code', 'country',
            'locale', 'home_tel', 'mobile', 'work_tel', 'work_email', 'other_email', ...allowedCustomKeys];

        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        });

        if (!isValidOperation) {
            res.status(400).send({message: 'invalid request'});
            return;
        }


        const employee = await Employee.findById(emp_id).populate({
            path: 'contact'
        }).select('_id');


        if (!employee) {
            res.status(404).send({message: 'employee not found'});
            return;
        }

        const customKeys = keys.filter((key) => {
            return allowedCustomKeys.includes(key);
        })

        const defaultKeys = keys.filter((key) => {
            return !customKeys.includes(key);
        });

        if (employee.contact.length === 0) {

            let contactObj = {};
            defaultKeys.forEach((defaultKey) => {
                contactObj[defaultKey] = req.body[defaultKey];
            })
            contactObj.custom_fields = {};
            for (const customKey of customKeys) {
                contactObj.custom_fields[customKey] = await CustomField.validateAField('contact', customKey, req.body[customKey]);
            }

            const contact = new Contact({
                ...contactObj,
                employee: emp_id
            });
            contact.markModified('custom_fields');
            await contact.save();
            await contact.populate({
                path: 'country locale',
                select: 'name local location'
            }).execPopulate();

            const final = contact.toObject();
            delete final.__v;
            delete final.id;
            res.send(final);
            return;
        }

        const contact = await Contact.findOne({employee: employee._id});
        defaultKeys.forEach((update) => {
            contact[update] = req.body[update];
        });

        if (!contact.custom_fields) {
            let customFields = {};
            for (const customKey of customKeys) {
                customFields[customKey] = await CustomField.validateAField('contact', customKey, req.body[customKey]);
            }
            contact.custom_fields = customFields;
            contact.markModified('custom_fields');
        }else {
            for (const customKey of customKeys) {
                contact.custom_fields[customKey] = await CustomField.validateAField('contact', customKey, req.body[customKey]);
            }
            contact.markModified('custom_fields');
        }


        await contact.save();
        await contact.populate({
            path: 'country locale',
            select: 'name local location'
        }).execPopulate();

        const final = contact.toObject();
        delete final.__v;
        delete final.id;

        res.send(final);

    } catch (e) {
        res.status(500).send(e);
    }
}

const updateMyContactDetail = async (req, res) => {
    await updateEmployeeContact(req, res, req.user.employee);
}

const updateEmployeeContactDetail = async (req, res) => {
    await updateEmployeeContact(req, res, req.params.emp_id);
}


const readContact = async (req, res, id) => {
    try {
        const employeeContact = await Employee.findById(id).populate({
            path: 'contact',
            populate: {
                path: 'country locale',
                select: 'name code local location'
            },
            select: '-__v'
        }).select('contact');

        if (!employeeContact) {
            res.status(404).send({message: 'employee not found'});
            return;
        }
        if (employeeContact.contact.length === 0) {
            res.status(404).send({message: 'contact not found'});
        } else {
            let final = {};
            final.employee_id = employeeContact._id;
            final.contact = employeeContact.contact[0].toObject();
            delete final.contact.id;
            res.send(final);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}


const readMyContactInfo = async (req, res) => {
    await readContact(req, res, req.user.employee);
}


const readAnEmployeeContact = async (req, res) => {
    await readContact(req, res, req.params.emp_id);
}


module.exports = {updateMyContactDetail, updateEmployeeContactDetail, readMyContactInfo, readAnEmployeeContact}