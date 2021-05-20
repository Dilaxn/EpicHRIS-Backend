const {CustomField} = require('../models/custom_field');
const {Employee} = require('../models/employee');
const {Contact} = require('../models/contact');
const {EmergencyContact} = require('../models/emergency_contact');
const {Dependent} = require('../models/dependent');
const {Immigration} = require('../models/immigration');
const {Job} = require('../models/job');
const {SalaryComponent} = require('../models/salary_component');
const {ReportTo} = require('../models/report_to');
const {WorkExperience} = require('../models/work_experience');
const {Education} = require('../models/education');
const {EmployeeSkill} = require('../models/employee_skill');
const {EmployeeLanguage} = require('../models/employee_language');
const {EmployeeLicense} = require('../models/employee_license');
const {EmployeeMembership} = require('../models/employee-membership');

const isValidChoice = (choice, type) => {
    if (type === 'String') {
        return choice.every((ch) => {
            return typeof ch === 'string';
        });
    }

    if (type === 'Number') {
        return choice.every((ch) => {
            return Number.isFinite(ch);
        })
    }

    return false;

}
const addACustomField = async (req, res) => {
    try {
        if (req.body.choice && req.body.field_type) {
            if (!isValidChoice(req.body.choice, req.body.field_type)) {
                res.status(400).send({message: 'invalid choice'});
                return;
            }
        }
        const newCustomField = new CustomField({
            ...req.body
        });

        if (!newCustomField) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const exist = await CustomField.findOne({name: newCustomField.name, screen: newCustomField.screen});
        if (exist) {
            res.status(400).send({message: 'custom field already exist'});
            return;
        }

        await newCustomField.save();
        const final = newCustomField.toObject();
        delete final.__v;
        delete final.id;
        res.status(201).send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const getACustomField = async (req, res) => {
    try {
        const customField = await CustomField.findById(req.params.id).select('-__v');
        if (!customField) {
            res.status(404).send({message: 'custom field not found'});
            return;
        }
        const final = customField.toObject();
        delete final.id;
        res.send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const getAllCustomFields = async (req, res) => {
    try {
        const customFields = await CustomField.find({}).select('-__v');
        if (!customFields || customFields.length === 0) {
            res.status(404).send({message: 'custom fields not found'});
            return;
        }

        const final = [];
        customFields.forEach((customField) => {
            const obj = customField.toObject();
            delete obj.id;
            final.push(obj);
        })

        res.send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const updateACustomField = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedKeys = ['name', 'screen', 'field_type', 'choice'];
        const isValidOperation = updates.every((update) => {
            return allowedKeys.includes(update);
        })

        if (!isValidOperation) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const custom = await CustomField.findById(req.params.id);
        if (!custom) {
            res.status(404).send({message: 'custom field not found'});
            return;
        }

        updates.forEach((update) => {
            custom[update] = req.body[update];
        })

        await custom.save();
        const final = custom.toObject();
        delete final.id;
        delete final.__v;
        res.send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const deleteCustomFields = async (req, res) => {
    try {
        const ids = req.body.custom_fields;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const final = [];

        for (const id of ids) {
            const custom = await CustomField.findByIdAndDelete(id).select('-__v');
            if (custom) {
                const screen = custom.screen;
                const name = custom.name;
                let updatedDocs = 0;
                switch (screen) {
                    case 'personal':
                    {
                        const employees = await Employee.find({});
                        for (const emp of employees) {
                            if (emp.custom_fields) {
                                if (emp.custom_fields.hasOwnProperty(name)) {
                                    delete emp.custom_fields[name];
                                    emp.markModified('custom_fields');
                                    await emp.save();
                                    updatedDocs ++;
                                }
                            }
                        }
                        break;
                    }

                    case 'contact': {
                        const contacts = await Contact.find({});
                        for (const contact of contacts) {
                            if (contact.custom_fields) {
                                if (contact.custom_fields.hasOwnProperty(name)) {
                                    delete contact.custom_fields[name];
                                    contact.markModified('custom_fields');
                                    await contact.save();
                                    updatedDocs ++;
                                }
                            }
                        }
                        break;
                    }

                    case 'emergency_contact': {
                        const emergencyContacts = await EmergencyContact.find({});
                        for (const emergencyContact of emergencyContacts) {
                            if (emergencyContact.custom_fields) {
                                if (emergencyContact.custom_fields.hasOwnProperty(name)) {
                                    delete emergencyContact.custom_fields[name];
                                    emergencyContact.markModified('custom_fields');
                                    await emergencyContact.save();
                                    updatedDocs ++;
                                }
                            }
                        }
                        break;
                    }

                    case 'dependent': {
                        const dependents = await Dependent.find({});
                        for (const dependent of dependents) {
                            if (dependent.custom_fields) {
                                if (dependent.custom_fields.hasOwnProperty(name)) {
                                    delete dependent.custom_fields[name];
                                    dependent.markModified('custom_fields');
                                    await dependent.save();
                                    updatedDocs ++;
                                }
                            }
                        }
                        break;
                    }

                    case 'immigration': {
                        const immigrations = await Immigration.find({});
                        for (const immigration of immigrations) {
                            if (immigration.custom_fields) {
                                if (immigration.custom_fields.hasOwnProperty(name)) {
                                    delete immigration.custom_fields[name];
                                    immigration.markModified('custom_fields');
                                    await immigration.save();
                                    updatedDocs ++;
                                }
                            }
                        }
                        break;
                    }

                    case 'job': {
                        const jobs = await Job.find({});
                        for (const job of jobs) {
                            if (job.custom_fields) {
                                if (job.custom_fields.hasOwnProperty(name)) {
                                    delete job.custom_fields[name];
                                    job.markModified('custom_fields');
                                    await job.save();
                                    updatedDocs ++;
                                }
                            }
                        }
                        break;
                    }

                    case 'salary': {
                        const salaryComponents = await SalaryComponent.find({});
                        for (const salaryComponent of salaryComponents) {
                            if (salaryComponent.custom_fields) {
                                if (salaryComponent.custom_fields.hasOwnProperty(name)) {
                                    delete salaryComponent.custom_fields[name];
                                    salaryComponent.markModified('custom_fields');
                                    await salaryComponent.save();
                                    updatedDocs ++;
                                }
                            }
                        }
                        break;
                    }

                    case 'report_to': {
                        const reportsTo = await ReportTo.find({});
                        for (const reportsToElement of reportsTo) {
                            if (reportsToElement.custom_fields) {
                                if (reportsToElement.custom_fields.hasOwnProperty(name)) {
                                    delete reportsToElement.custom_fields[name];
                                    reportsToElement.markModified('custom_fields');
                                    await reportsToElement.save();
                                    updatedDocs ++;
                                }
                            }
                        }
                        break;
                    }

                    case 'work_experience': {
                        const workExperiences = await WorkExperience.find({});
                        for (const experience of workExperiences) {
                            if (experience.custom_fields) {
                                if (experience.custom_fields.hasOwnProperty(name)) {
                                    delete experience.custom_fields[name];
                                    experience.markModified('custom_fields');
                                    await experience.save();
                                    updatedDocs ++;
                                }
                            }
                        }
                        break;
                    }

                    case 'education': {
                        const educations = await Education.find({});
                        for (const education of educations) {
                            if (education.custom_fields) {
                                if (education.custom_fields.hasOwnProperty(name)) {
                                    delete education.custom_fields[name];
                                    education.markModified('custom_fields');
                                    await education.save();
                                    updatedDocs ++;
                                }
                            }
                        }
                        break;
                    }

                    case 'skill': {
                        const skills = await EmployeeSkill.find({});
                        for (const skill of skills) {
                            if (skill.custom_fields) {
                                if (skill.custom_fields.hasOwnProperty(name)) {
                                    delete skill.custom_fields[name];
                                    skill.markModified('custom_fields');
                                    await skill.save();
                                    updatedDocs ++;
                                }
                            }
                        }
                        break;
                    }

                    case 'language': {
                        const languages = await EmployeeLanguage.find({});
                        for (const language of languages) {
                            if (language.custom_fields) {
                                if (language.custom_fields.hasOwnProperty(name)) {
                                    delete language.custom_fields[name];
                                    language.markModified('custom_fields');
                                    await language.save();
                                    updatedDocs ++;
                                }
                            }
                        }
                        break;
                    }

                    case 'license': {
                        const licenses = await EmployeeLicense.find({});
                        for (const license of licenses) {
                            if (license.custom_fields) {
                                if (license.custom_fields.hasOwnProperty(name)) {
                                    delete license.custom_fields[name];
                                    license.markModified('custom_fields');
                                    await license.save();
                                }
                            }
                        }
                        break;
                    }

                    case 'membership': {
                        const memberships = await EmployeeMembership.find({});
                        for (const membership of memberships) {
                            if (membership.custom_fields) {
                                if (membership.custom_fields.hasOwnProperty(name)) {
                                    delete membership.custom_fields[name];
                                    membership.markModified('custom_fields');
                                    await membership.save();
                                }
                            }
                        }
                        break;
                    }
                }

                let customObj = custom.toObject();
                delete customObj.id;

                final.push({customObj, updated: updatedDocs});
            }
        }

        if (final.length === 0) {
            res.status(404).send({message: 'non of custom fields deleted'});
            return;
        }

        res.send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const getAllCustomFieldsOfAScreen = async (req, res) => {
    try {
        const customFields = await CustomField.find({screen: req.params.screen}).select('-__v');
        if (!customFields || customFields.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }
        const final = [];
        customFields.forEach((customField) => {
            const obj = customField.toObject();
            delete obj.id;
            final.push(obj);
        })
        res.send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
    addACustomField,
    getACustomField,
    getAllCustomFields,
    updateACustomField,
    deleteCustomFields,
    getAllCustomFieldsOfAScreen
}