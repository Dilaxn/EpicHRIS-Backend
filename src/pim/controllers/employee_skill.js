const {EmployeeSkill} = require('../models/employee_skill');
const {Employee} = require('../models/employee');
const {CustomField} = require('../models/custom_field');

const addASkill = async (req, res, emp_id) => {
    try {
        const keys = Object.keys(req.body);
        const allowedCustomKeys = await CustomField.getCustomFieldsName('skill');
        const allowedKeys = ['skill', 'years_of_experience', 'comment', ...allowedCustomKeys];

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

        let skillObj = {};
        if (defaultKeys.length > 0) {
            defaultKeys.forEach((defaultKey) => {
                skillObj[defaultKey] = req.body[defaultKey];
            })
        }

        if (customKeys.length > 0) {
            skillObj.custom_fields = {};
            for (const customKey of customKeys) {
                skillObj.custom_fields[customKey] = await CustomField.validateAField('skill', customKey, req.body[customKey]);
            }
        }

        const skill = new EmployeeSkill({
            ...skillObj,
            employee: emp_id
        });

        if (!skill) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const exist = await EmployeeSkill.findOne({skill: skill.skill, employee: emp_id});
        if (exist) {
            res.status(400).send({message: 'skill already added'});
            return;
        }

        await skill.save();
        await skill.populate({
            path: 'skill',
            select: '-__v'
        }).execPopulate();

        const final = skill.toObject();
        delete final.id;
        delete final.__v;

        res.status(201).send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const addMySkill = async (req, res) => {
    await addASkill(req, res, req.user.employee);
}

const addASkillToAnEmployee = async (req, res) => {
    await addASkill(req, res, req.params.emp_id);
}

const readASkill = async (req, res, emp_id) => {
    try {
        const skill = await EmployeeSkill.findOne({employee: emp_id, _id: req.params.id}).populate({
            path: 'skill',
            select: '-__v'
        }).select('-__v');

        if (!skill) {
            res.status(404).send({message: 'not found'});
            return;
        }

        const final = skill.toObject();
        delete final.id;
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}


const getMySkill = async (req, res) => {
    await readASkill(req, res, req.user.employee);
}

const readASkillOfAnEmployee = async (req, res) => {
    await readASkill(req, res, req.params.emp_id);
}

const readAllSkills = async (req, res, emp_id) => {
    try {
        const employee = await Employee.findById(emp_id).populate({
            path: 'skills',
            select: '-__v',
            populate: {
                path: 'skill',
                select: '-__v'
            }
        }).select('skills');

        if (!employee || !employee.skills ) {
            res.status(404).send({message: 'not found'});
            return;
        }

        const final = employee.toObject();
        delete final.id;
        final.skills.forEach((skill) => {
            delete skill.id;
            delete skill.employee;
        })
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readMyAllSkills = async (req, res) => {
    await readAllSkills(req, res, req.user.employee);
}

const readAllSkillsOfAnEmployee = async (req, res) => {
    await readAllSkills(req, res, req.params.emp_id);
}

const updateSkill = async (req, res, emp_id) => {
    try {
        const keys = Object.keys(req.body);
        const allowedCustomKeys = await CustomField.getCustomFieldsName('skill');
        const allowedKeys = ['skill', 'years_of_experience', 'comment', ...allowedCustomKeys];

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

        const skill = await EmployeeSkill.findOne({employee: emp_id, _id: req.params.id});
        if (!skill) {
            res.status(404).send({message: 'not found'});
            return;
        }

        if (defaultKeys.length > 0) {
            defaultKeys.forEach((defaultKey) => {
                skill[defaultKey] = req.body[defaultKey];
            })
        }

        if (customKeys.length > 0) {
            if (!skill.custom_fields) {
                skill.custom_fields = {};
                for (const customKey of customKeys) {
                    skill.custom_fields[customKey] = await CustomField.validateAField('skill', customKey, req.body[customKey]);
                }
            }else {
                for (const customKey of customKeys) {
                    skill.custom_fields[customKey] = await CustomField.validateAField('skill', customKey, req.body[customKey]);
                }
            }

            skill.markModified('custom_fields');
        }

        await skill.save();
        await skill.populate({
            path: 'skill',
            select: '-__v'
        }).execPopulate();

        const final = skill.toObject();
        delete final.id;
        delete final.__v;
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const updateMySkill = async (req, res) => {
    await updateSkill(req, res, req.user.employee);
}

const updateASkillOfAnEmployee = async (req, res) => {
    await updateSkill(req, res, req.params.emp_id);
}

const deleteSkills = async (req, res, emp_id) => {
    const ids = req.body.skills;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        res.status(400).send({message: 'invalid request'});
        return;
    }

    try {
        const response = [];
        for (const id of ids) {
            const deleted = await EmployeeSkill.findOneAndDelete({employee: emp_id, _id: id}).select('-__v');
            if (deleted) {
                const obj = deleted.toObject();
                delete obj.id;
                response.push(deleted);
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

const deleteMySkills = async (req, res) => {
    await deleteSkills(req, res, req.user.employee);
}

const deleteSkillsOfAnEmployee = async (req, res) => {
    await deleteSkills(req, res, req.params.emp_id);
}

module.exports = {
    addMySkill,
    addASkillToAnEmployee,
    getMySkill,
    readASkillOfAnEmployee,
    readMyAllSkills,
    readAllSkillsOfAnEmployee,
    updateMySkill,
    updateASkillOfAnEmployee,
    deleteMySkills,
    deleteSkillsOfAnEmployee
}