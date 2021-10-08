const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const {EidConfiguration} = require('../models/eid_configuration');
const {Contact} = require('../models/contact');
const {EmergencyContact} = require('../models/emergency_contact');
const {ReportTo} = require('../models/report_to');
const {Dependent} = require('../models/dependent');
const {Immigration} = require('../models/immigration');
const {Job} = require('../models/job');
const {Termination} = require('../models/termination');
const {SalaryComponent} = require('../models/salary_component');
const {WorkExperience} = require('../models/work_experience');
const {Education} = require('../models/education');
const {EmployeeSkill} = require('../models/employee_skill');
const {EmployeeLanguage} = require('../models/employee_language');
const {EmployeeLicense} = require('../models/employee_license');
const {EmployeeMembership} = require('../models/employee-membership');
const User = require('../../admin/models/user');
const {Attachment} = require('../models/attachment');


const employeeSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 20,
        minlength: 2,
        validate(value) {
            this.first_name = value.replace(/\s/g, '');
        }
    },
    middle_name: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 20,
        minlength: 3,
        validate(value) {
            this.middle_name = value.replace(/\s/g, '');
        }
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 20,
        minlength: 3,
        validate(value) {
            this.last_name = value.replace(/\s/g, '');
        }
    },
    employee_id: {
        type: String,
        required: true,
        unique: true
    },
    nic: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        lowercase: true,
        enum: ["male", "female", null]
    },
    marital_status: {
        type: String,
        lowercase: true,
        enum: ["single", "married", "other", null]
    },
    nationality: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nationality'
    },
    date_of_birth: {
        type: Date,
        max: Date.now(),
        min: '1900-01-01'
    },
    nick_name: {
        type: String,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 20
    },
    smoker: {
        type: Boolean
    },
    military_service: {
        type: String,
        trim: true,
        maxlength: 100
    },
    avatar: {
        type: Buffer
    },
    driving_license_no: {
        type: String,
        trim: true
    },
    license_expiry_date: {
        type: Date
    },
    ssn: {
        type: String,
        trim: true
    },
    sin: {
        type: String,
        trim: true
    },
    custom_fields: {}
});


// (async () => {
//     const customFields = await CustomField.generateCustomSchema('personal');
//     if (customFields.length > 0) {
//         customFields.forEach((customSchema) => {
//             employeeSchema.add(customSchema);
//         })
//     }
// })();


employeeSchema.plugin(idValidator);
employeeSchema.plugin(mongooseLeanVirtuals);

employeeSchema.set('toObject', {virtuals: true});
employeeSchema.set('toJSON', {virtuals: true});

employeeSchema.virtual('contact', {
    ref: 'Contact',
    localField: '_id',
    foreignField: 'employee'
})

employeeSchema.virtual('emergency_contacts', {
    ref: 'EmergencyContact',
    localField: '_id',
    foreignField: 'employee'
})

employeeSchema.virtual('supervisors', {
    ref: 'ReportTo',
    localField: '_id',
    foreignField: 'subordinate',
    justOne: false
});

employeeSchema.virtual('subordinates', {
    ref: 'ReportTo',
    localField: '_id',
    foreignField: 'supervisor',
    justOne: false
});

employeeSchema.virtual('dependents', {
    ref: 'Dependent',
    localField: '_id',
    foreignField: 'employee'
});

employeeSchema.virtual('immigrations', {
    ref: 'Immigration',
    localField: '_id',
    foreignField: 'employee'
});

employeeSchema.virtual('job', {
    ref: 'Job',
    localField: '_id',
    foreignField: 'employee'
});

employeeSchema.virtual('salary_components', {
    ref: 'SalaryComponent',
    localField: '_id',
    foreignField: 'employee'
});

employeeSchema.virtual('educations', {
    ref: 'Education',
    localField: '_id',
    foreignField: 'employee'
});

employeeSchema.virtual('skills', {
    ref: 'EmployeeSkill',
    localField: '_id',
    foreignField: 'employee'
});

employeeSchema.virtual('languages', {
    ref: 'EmployeeLanguage',
    localField: '_id',
    foreignField: 'employee'
});

employeeSchema.virtual('licenses', {
    ref: 'EmployeeLicense',
    localField: '_id',
    foreignField: 'employee'
});

employeeSchema.virtual('memberships', {
    ref: 'EmployeeMembership',
    localField: '_id',
    foreignField: 'employee'
})

employeeSchema.virtual('termination', {
    ref: 'Termination',
    localField: '_id',
    foreignField: 'employee'
})

employeeSchema.virtual('work_experiences', {
    ref: 'WorkExperience',
    localField: '_id',
    foreignField: 'employee'
});


const generateNumberWithLeadingZero = (num, size) => {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

employeeSchema.methods.generateEid = async function (transaction = 0) {
    const eidConf = await EidConfiguration.findOne({});
    let eid;
    if (eidConf.prefix) {
        eid = eidConf.prefix;
    }

    const digit = eidConf.highest_number + eidConf.increase_by;
    eid += generateNumberWithLeadingZero(digit, eidConf.number_length);

    if (eidConf.suffix) {
        eid += eidConf.suffix;
    }

    eidConf.highest_number += eidConf.increase_by;
    if (transaction !== 0) {
        transaction.update('EidConfiguration', eidConf._id, eidConf);
    } else {
        await eidConf.save();
    }
    return eid;
}


employeeSchema.pre('remove', async function (next) {
    const employee = this;
    const contact = await Contact.findOne({employee: employee._id});
    if (contact) {
        contact.remove();
    }
    const emergencyContacts = await EmergencyContact.find({employee: employee._id});
    if (emergencyContacts.length > 0) {
        for (const emergencyContact of emergencyContacts) {
            emergencyContact.remove();
        }
    }
    const reportTosAsSupervisor = await ReportTo.find({supervisor: employee._id});
    if (reportTosAsSupervisor.length > 0) {
        reportTosAsSupervisor.forEach((reportToSup) => {
            reportToSup.remove();
        })
    }

    const reportTosAsSubOrdinate = await ReportTo.find({subordinate: employee._id});
    if (reportTosAsSubOrdinate.length > 0) {
        reportTosAsSubOrdinate.forEach((reportToSub) => {
            reportToSub.remove();
        })
    }

    const dependents = await Dependent.find({employee: employee._id});
    if (dependents.length > 0) {
        dependents.forEach((dependent) => {
            dependent.remove();
        })
    }

    const immigrations = await Immigration.find({employee: employee._id});
    if (immigrations.length > 0) {
        immigrations.forEach((immigration) => {
            immigration.remove();
        })
    }

    const job = await Job.findOne({employee: employee._id});
    if (job) {
        job.remove();
    }

    const termination = await Termination.findOne({employee: employee._id});
    if (termination) {
        termination.remove();
    }

    const salaryComponents = await SalaryComponent.find({employee: employee._id});
    if (salaryComponents.length > 0) {
        for (const salaryComponent of salaryComponents) {
            await salaryComponent.remove();
        }
    }

    const workExperiences = await WorkExperience.find({employee: employee._id});
    if (workExperiences.length > 0) {
        for (const workExperience of workExperiences) {
            await workExperience.remove();
        }
    }

    const educations = await Education.find({employee: employee._id});
    if (educations.length > 0) {
        for (const education of educations) {
            await education.remove();
        }
    }

    const employeeSkills = await EmployeeSkill.find({employee: employee._id});
    if (employeeSkills.length > 0) {
        for (const employeeSkill of employeeSkills) {
            await employeeSkill.remove();
        }
    }

    const employeeLanguages = await EmployeeLanguage.find({employee: employee._id});
    if (employeeLanguages.length > 0) {
        for (const employeeLanguage of employeeLanguages) {
            await employeeLanguage.remove();
        }
    }

    const employeeLicenses = await EmployeeLicense.find({employee: employee._id});
    if (employeeLicenses.length > 0) {
        for (const employeeLicense of employeeLicenses) {
            await employeeLicense.remove();
        }
    }

    const employeeMemberships = await EmployeeMembership.find({employee: employee._id});
    if (employeeMemberships.length > 0) {
        for (const employeeMembership of employeeMemberships) {
            await employeeMembership.remove();
        }
    }

    const user = await User.findOne({employee: employee._id});
    if (user) {
        await user.remove();
    }

    const attachmentsByAddedPerson = await Attachment.find({added_by: employee._id}).select('added_by');
    if (attachmentsByAddedPerson.length > 0) {
        for (const attachment of attachmentsByAddedPerson) {
            attachment.added_by = undefined;
            await attachment.save();
        }
    }

    const attachmentsByModifiedPerson = await Attachment.find({modified_by: employee._id}).select('modified_by');
    if (attachmentsByModifiedPerson.length > 0) {
        for (const attachment of attachmentsByModifiedPerson) {
            attachment.modified_by = undefined;
            await attachment.save();
        }
    }

    const attachmentsByEmployee = await Attachment.find({employee: employee._id});
    if (attachmentsByEmployee.length > 0) {
        for (const attachment of attachmentsByEmployee) {
            attachment.remove();
        }
    }

    next();
})

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = {employeeSchema, Employee, generateNumberWithLeadingZero};