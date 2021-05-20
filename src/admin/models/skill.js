const mongoose = require('mongoose');
const {EmployeeSkill} = require('../../pim/models/employee_skill');
const {EmployeeReport} = require('../../pim/models/employee_report');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 30,
        minlength: 2,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 100
    }
});

skillSchema.pre('remove', async function (next) {
    const skill = this;
    const employeeSkills = await EmployeeSkill.find({skill: skill._id});
    if (employeeSkills.length > 0) {
        for (const employeeSkill of employeeSkills) {
            await employeeSkill.remove();
        }
    }

    const reports = await EmployeeReport.find({'selected_criteria.skill': skill._id});
    if (reports.length > 0) {
        for (const report of reports) {
            report.selected_criteria.skill = undefined;
            await report.save();
        }
    }
    next();
})

const Skill = mongoose.model('Skill', skillSchema);

module.exports = {
    skillSchema,
    Skill
}