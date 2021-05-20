const {EmployeeLanguage} = require('../models/employee_language');
const {Employee} = require('../models/employee');
const {CustomField} = require('../models/custom_field');


const addALanguage = async (req, res, emp_id) => {
    try {
        const keys = Object.keys(req.body);
        const allowedCustomKeys = await CustomField.getCustomFieldsName('language');
        const allowedKeys = ['language', 'fluency', 'competency', 'comment', ...allowedCustomKeys];
        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        });

        if (!isValidOperation || keys.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const exist = await EmployeeLanguage.findOne({
            employee: emp_id,
            language: req.body.language,
            fluency: req.body.fluency
        });
        if (exist) {
            res.status(400).send({message: 'language already exist'});
            return;
        }

        const customKeys = keys.filter((key) => {
            return allowedCustomKeys.includes(key);
        });

        const defaultKeys = keys.filter((key) => {
            return !customKeys.includes(key);
        })

        let languageObj = {};

        if (defaultKeys.length > 0) {
            defaultKeys.forEach((defaultKey) => {
                languageObj[defaultKey] = req.body[defaultKey];
            })
        }

        if (customKeys.length > 0) {
            languageObj.custom_fields = {};
            for (const customKey of customKeys) {
                languageObj.custom_fields[customKey] = await CustomField.validateAField('language', customKey, req.body[customKey]);
            }
        }
        const language = new EmployeeLanguage({
            ...languageObj,
            employee: emp_id
        });

        if (!language) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await language.save();
        await language.populate({
            path: 'language',
            select: '-__v'
        }).populate({
            path: 'fluency',
            select: '-__v'
        }).populate({
            path: 'competency',
            select: '-__v'
        }).execPopulate();

        const final = language.toObject();
        delete final.__v;
        delete final.id;

        res.status(201).send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}
const addMyLanguage = async (req, res) => {
    await addALanguage(req, res, req.user.employee);
}

const addALanguageOfAnEmployee = async (req, res) => {
    await addALanguage(req, res, req.params.emp_id);
}

const readALanguage = async (req, res, emp_id) => {
    try {
        const language = await EmployeeLanguage.findOne({employee: emp_id, _id: req.params.id}).populate({
            path: 'language'
        }).populate({
            path: 'fluency'
        }).populate({
            path: 'competency'
        });

        if (!language) {
            res.status(404).send();
            return;
        }

        res.send(language);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readMyLanguage = async (req, res) => {
    await readALanguage(req, res, req.user.employee);
}

const readALanguageOfAnEmployee = async (req, res) => {
    await readALanguage(req, res, req.params.emp_id);
}

const readAllLang = async (req, res, emp_id) => {
    try {
        const employee = await Employee.findById(emp_id).populate({
            path: 'languages',
            select: '-__v',
            populate: {
                path: 'language fluency competency',
                select: '-__v'
            }
        }).select('languages');

        if (!employee || !employee.languages ) {
            res.status(404).send({message: 'not found'});
            return;
        }

        const final = employee.toObject();
        delete final.id;
        if (final.languages.length > 0) {
            final.languages.forEach((language) => {
                delete language.employee;
                delete language.id;
            })
        }


        res.send(final);

    } catch (e) {
        res.status(500).send(e);
    }
}

const readMyAllLanguages = async (req, res) => {
    await readAllLang(req, res, req.user.employee);
}

const readAllLanguagesOfAnEmployee = async (req, res) => {
    await readAllLang(req, res, req.params.emp_id);
}


const updateALang = async (req, res, emp_id) => {
    try {
        const updates = Object.keys(req.body);
        const allowedCustomUpdates = await CustomField.getCustomFieldsName('language');
        const allowedUpdates = ['competency', 'comment', ...allowedCustomUpdates];
        const isValidOperation = updates.every((update) => {
            return allowedUpdates.includes(update);
        });

        if (!isValidOperation) {
            res.status(400).send({message: 'invalid request'});
            return;
        }
        const language = await EmployeeLanguage.findOne({employee: emp_id, _id: req.params.id});
        if (!language) {
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
                language[defaultUpdate] = req.body[defaultUpdate];
            })
        }

        if (customUpdates.length > 0) {
            if (!language.custom_fields) {
                language.custom_fields = {};
                for (const customUpdate of customUpdates) {
                    language.custom_fields[customUpdate] = await CustomField.validateAField('language', customUpdate, req.body[customUpdate]);
                }
            }else {
                for (const customUpdate of customUpdates) {
                    language.custom_fields[customUpdate] = await CustomField.validateAField('language', customUpdate, req.body[customUpdate]);
                }
            }
            language.markModified('custom_fields');
        }

        await language.save();
        await language.populate({
            path: 'language',
            select: '-__v'
        }).populate({
            path: 'fluency',
            select: '-__v'
        }).populate({
            path: 'competency',
            select: '-__v'
        }).execPopulate();

        const final = language.toObject();
        delete final.id;
        delete final.__v;

        res.send(final);

    } catch (e) {
        res.status(500).send(e);
    }
}
const updateMyLanguage = async (req, res) => {
    await updateALang(req, res, req.user.employee);
}

const updateALanguageOfAnEmployee = async (req, res) => {
    await updateALang(req, res, req.params.emp_id);
}

const deleteLang = async (req, res, emp_id) => {
    try {
        const ids = req.body.languages;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'not found'});
            return;
        }

        const response = [];

        for (const id of ids) {
            const language = await EmployeeLanguage.findOne({employee: emp_id, _id: id}).select('-__v');
            if (language) {
                await language.remove();
                const languageObj = language.toObject();
                delete languageObj.id;
                response.push(languageObj);
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

const deleteMyLanguages = async (req, res) => {
    await deleteLang(req, res, req.user.employee);
}

const deleteLanguagesOfAnEmployee = async (req, res) => {
    await deleteLang(req, res, req.params.emp_id);
}

module.exports = {
    addMyLanguage,
    addALanguageOfAnEmployee,
    readMyLanguage,
    readALanguageOfAnEmployee,
    readMyAllLanguages,
    readAllLanguagesOfAnEmployee,
    updateMyLanguage,
    updateALanguageOfAnEmployee,
    deleteMyLanguages,
    deleteLanguagesOfAnEmployee
}