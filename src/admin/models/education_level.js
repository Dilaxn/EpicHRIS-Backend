const mongoose = require('mongoose');
const {Education} = require('../../pim/models/education');
const {EmployeeReport} = require('../../pim/models/employee_report');

const educationLevelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
        minlength: 2
    }
});

educationLevelSchema.pre('remove', async function (next) {
    const educationLevel = this;
    const educations = await Education.find({level: educationLevel._id});
    if (educations.length > 0) {
        for (const education of educations) {
            await education.remove();
        }
    }

    const reports = await EmployeeReport.find({'selected_criteria.education': educationLevel._id});
    if (reports.length > 0) {
        for (const report of reports) {
            report.selected_criteria.education = undefined;
            await report.save();
        }
    }

    next();
})
const EducationLevel = mongoose.model('EducationLevel', educationLevelSchema);

module.exports = {
    educationLevelSchema,
    EducationLevel
}