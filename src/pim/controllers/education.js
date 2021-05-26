const {Education} = require('../models/education');
const {Employee} = require('../models/employee');
const {CustomField} = require('../models/custom_field');


const addEducation = async (req, res, emp_id) => {
    try {
        const keys = Object.keys(req.body);
        const allowedCustomKeys = await CustomField.getCustomFieldsName('education');
        const allowedKeys = ['level', 'institute', 'specialization', 'gpa', 'start_date', 'end_date',
            'year', ...allowedCustomKeys];

        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        })

        if (!isValidOperation) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const customKeys = keys.filter((key) => {
            return allowedCustomKeys.includes(key);
        });

        const defaultKeys = keys.filter((key) => {
            return !customKeys.includes(key);
        });

        let educationObj = {};
        if (defaultKeys.length > 0) {
            defaultKeys.forEach((defaultKey) => {
                educationObj[defaultKey] = req.body[defaultKey];
            })
        }

        if (customKeys.length > 0) {
            educationObj.custom_fields = {};
            for (const customKey of customKeys) {
                educationObj.custom_fields[customKey] = await CustomField.validateAField('education', customKey, req.body[customKey]);
            }
        }

        const education = new Education({
            ...educationObj,
            employee: emp_id
        });

        if (!education) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await education.save();
        await education.populate({
            path: 'level',
            select: '-__v'
        }).execPopulate();

        const final = education.toObject();
        delete final.id;
        delete final.__v;

        res.status(201).send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}
const addMyEducation = async (req, res) => {
    await addEducation(req, res, req.user.employee);
}

const addEducationOfAnEmployee = async (req, res) => {
    await addEducation(req, res, req.params.emp_id);
}

const readEducation = async (req, res, emp_id) => {
    try {
        const education = await Education.findOne({employee: emp_id, _id: req.params.id}).populate({
            path: 'level',
            select: '-__v'
        }).select('-__v');

        if (!education) {
            res.status(404).send({message: 'not found'});
            return;
        }

        const final = education.toObject();
        delete final.id;
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readMyEducation = async (req, res) => {
    await readEducation(req, res, req.user.employee);
}

const readEducationOfAnEmployee = async (req, res) => {
    await readEducation(req, res, req.params.emp_id);
}

const readAllEducation = async (req, res, emp_id) => {
    try {
        const employee = await Employee.findById(emp_id).populate({
            path: 'educations',
            select: '-__v',
            populate: {
                path: 'level',
                select: '-__v'
            }
        }).select('educations');

        if (!employee || !employee.educations ) {
            res.status(404).send({message: 'not found'});
            return;
        }


        const final = employee.toObject();
        delete final.id;
        final.educations.forEach((education) => {
            delete education.id;
            delete education.employee;
        })
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readMyAllEducation = async (req, res) => {
    await readAllEducation(req, res, req.user.employee);
}

const readAllEducationOfAnEmployee = async (req, res) => {
    await readAllEducation(req, res, req.params.emp_id);
}

const updateEducation = async (req, res, emp_id) => {
    try {
        const keys = Object.keys(req.body);
        const allowedCustomKeys = await CustomField.getCustomFieldsName('education');
        const allowedKeys = ['level', 'institute', 'specialization', 'gpa', 'start_date', 'end_date',
            'year', ...allowedCustomKeys];

        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        })

        if (!isValidOperation) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const education = await Education.findOne({employee: emp_id, _id: req.params.id});
        if (!education) {
            res.status(404).send({message: 'not found'});
            return;
        }

        const customKeys = keys.filter((key) => {
            return allowedCustomKeys.includes(key);
        });

        const defaultKeys = keys.filter((key) => {
            return !customKeys.includes(key);
        });

        if (defaultKeys.length > 0) {
            defaultKeys.forEach((defaultKey) => {
                education[defaultKey] = req.body[defaultKey];
            })
        }

        if (customKeys.length > 0) {
            if (!education.custom_fields) {
                education.custom_fields = {};
                for (const customKey of customKeys) {
                    education.custom_fields[customKey] = await CustomField.validateAField('education', customKey, req.body[customKey]);
                }
            }else {
                for (const customKey of customKeys) {
                    education.custom_fields[customKey] = await CustomField.validateAField('education', customKey, req.body[customKey]);
                }
            }

            education.markModified('custom_fields');
        }

        await education.save();
        await education.populate({
            path: 'level',
            select: '-__v'
        }).execPopulate();

        const final = education.toObject();
        delete final.id;
        delete final.__v;

        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const updateEducationOfMine = async (req, res) => {
    await updateEducation(req, res, req.user.employee);
}

const updateEducationOfAnEmployee = async (req, res) => {
    await updateEducation(req, res, req.params.emp_id);
}

const deleteEducations = async (req, res, emp_id) => {
    try {
        const ids = req.body.educations;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const response = [];

        for (const id of ids) {
            const deleted = await Education.findOneAndDelete({employee: emp_id, _id: id}).select('-__v');

            if (deleted) {
                const obj = deleted.toObject();
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

const deleteMyEducations = async (req, res) => {
    await deleteEducations(req, res, req.user.employee);
}

const deleteEducationsOfAnEmployee = async (req, res) => {
    await deleteEducations(req, res, req.params.emp_id);
}

module.exports = {
    addMyEducation,
    addEducationOfAnEmployee,
    readMyEducation,
    readEducationOfAnEmployee,
    readMyAllEducation,
    readAllEducationOfAnEmployee,
    updateEducationOfMine,
    updateEducationOfAnEmployee,
    deleteMyEducations,
    deleteEducationsOfAnEmployee
}