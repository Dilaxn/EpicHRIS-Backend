const {WorkExperience} = require('../models/work_experience');
const {CustomField} = require('../models/custom_field');


const addAWorkExperience = async (req, res, emp_id) => {
    try {
        const keys = Object.keys(req.body);
        const allowedCustomKeys = await CustomField.getCustomFieldsName('work_experience');
        const allowedKeys = ['company', 'title_of_job', 'from', 'to', 'comment', ...allowedCustomKeys];

        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        })

        if (!isValidOperation || keys.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const customKeys = keys.filter((key) => {
            return allowedCustomKeys.includes(key);
        })

        const defaultKeys = keys.filter((key) => {
            return !customKeys.includes(key);
        })

        let workExperienceObj = {};

        if (defaultKeys.length > 0) {
            defaultKeys.forEach((defaultKey) => {
                workExperienceObj[defaultKey] = req.body[defaultKey];
            })
        }

        if (customKeys.length > 0) {
            workExperienceObj.custom_fields = {};
            for (const customKey of customKeys) {
                workExperienceObj.custom_fields[customKey] = await CustomField.validateAField('work_experience', customKey, req.body[customKey]);
            }
        }
        const workExperience = new WorkExperience({
            ...workExperienceObj,
            employee: emp_id
        });

        if (!workExperience) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await workExperience.save();
        const final = workExperience.toObject();
        delete final.id;
        delete final.__v;
        res.status(201).send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}
const addMyWorkExperience = async (req, res) => {
    await addAWorkExperience(req, res, req.user.employee);
}

const addAWorkExperienceForAnEmployee = async (req, res) => {
    await addAWorkExperience(req, res, req.params.emp_id);
}

const readAWorkExperience = async (req, res, emp_id) => {
    try {
        const workExperience = await WorkExperience.findOne({employee: emp_id, _id: req.params.id}).select('-__v');
        if (!workExperience) {
            res.status(404).send({message: 'not found'});
            return;
        }
        const final = workExperience.toObject();
        delete final.id;
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const getAWorkExperienceOfMine = async (req, res) => {
    await readAWorkExperience(req, res, req.user.employee);
}

const readAWorkExperienceOfAnEmployee = async (req, res) => {
    await readAWorkExperience(req, res, req.params.emp_id);
}

const readAllWorkExperiences = async (req, res, emp_id) => {
    try {
        const workExperiences = await WorkExperience.find({employee: emp_id}).select('-__v');
        if (!workExperiences ) {
            res.status(404).send({message: 'not found'});
            return;
        }
        const final = [];
        workExperiences.forEach((workExperience) => {
            const obj = workExperience.toObject();
            delete obj.id;
            final.push(obj);
        })
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const realMyAllWorkExperiences = async (req, res) => {
    await readAllWorkExperiences(req, res, req.user.employee);
}

const realAllWorkExperiencesOfMine = async (req, res) => {
    await readAllWorkExperiences(req, res, req.params.emp_id);
}

const updateAWorkExperience = async (req, res, emp_id) => {
    try {
        const keys = Object.keys(req.body);
        const allowedCustomKeys = await CustomField.getCustomFieldsName('work_experience');
        const allowedKeys = ['company', 'title_of_job', 'from', 'to', 'comment', ...allowedCustomKeys];

        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        })

        if (!isValidOperation || keys.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const customKeys = keys.filter((key) => {
            return allowedCustomKeys.includes(key);
        })

        const defaultKeys = keys.filter((key) => {
            return !customKeys.includes(key);
        })

        const workExperience = await WorkExperience.findOne({employee: emp_id, _id: req.params.id});
        if (!workExperience) {
            res.status(404).send({message: 'not found'});
            return;
        }

        if (defaultKeys.length > 0) {
            defaultKeys.forEach((defaultKey) => {
                workExperience[defaultKey] = req.body[defaultKey];
            })
        }

        if (customKeys.length > 0) {
            if (!workExperience.custom_fields) {
                workExperience.custom_fields = {};
                for (const customKey of customKeys) {
                    workExperience.custom_fields[customKey] = await CustomField.validateAField('work_experience', customKey, req.body[customKey]);
                }
            }else {
                for (const customKey of customKeys) {
                    workExperience.custom_fields[customKey] = await CustomField.validateAField('work_experience', customKey, req.body[customKey]);
                }
            }

            workExperience.markModified('custom_fields');
        }

        await workExperience.save();
        const final = workExperience.toObject();
        delete final.id;
        delete final.__v;
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const updateMyWorkExperience = async (req, res) => {
    await updateAWorkExperience(req, res, req.user.employee);
}

const updateAWorkExperienceOfAnEmployee = async (req, res) => {
    await updateAWorkExperience(req, res, req.params.emp_id);
}

const deleteWorkExperiences = async (req, res, emp_id) => {
    try {
        const ids = req.body.work_experiences;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const response = [];

        for (const id of ids) {
            const deleted = await WorkExperience.findOneAndDelete({employee: emp_id, _id: id}).select('-__v');

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

const deleteMyWorkExperiences = async (req, res) => {
    await deleteWorkExperiences(req, res, req.user.employee);
}

const deleteWorkExperiencesOfAnEmployee = async (req, res) => {
    await deleteWorkExperiences(req, res, req.params.emp_id);
}


module.exports = {
    addMyWorkExperience,
    addAWorkExperienceForAnEmployee,
    getAWorkExperienceOfMine,
    readAWorkExperienceOfAnEmployee,
    realMyAllWorkExperiences,
    realAllWorkExperiencesOfMine,
    updateMyWorkExperience,
    updateAWorkExperienceOfAnEmployee,
    deleteMyWorkExperiences,
    deleteWorkExperiencesOfAnEmployee
}