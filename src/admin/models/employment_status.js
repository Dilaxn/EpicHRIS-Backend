const mongoose = require('mongoose');
const {Job} = require('../../pim/models/job');
const {EmployeeReport} = require('../../pim/models/employee_report');

const employmentStatusSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 30,
        trim: true,
        required: true,
        lowercase: true,
        unique: true
    }
});

employmentStatusSchema.pre('remove', async function (next) {
    const employmentStatus = this;
    const jobs = await Job.find({employment_status: employmentStatus._id});
    if (jobs.length > 0) {
        for (const job of jobs) {
            job.employment_status = undefined;
            await job.save();
        }
    }

    const reports = await EmployeeReport.find({'selected_criteria.employment_status': employmentStatus._id});
    if (reports.length > 0) {
        for (const report of reports) {
            report.selected_criteria.employment_status = undefined;
            await report.save();
        }
    }

    next();
})
const EmploymentStatus = mongoose.model('EmploymentStatus', employmentStatusSchema);

module.exports = {employmentStatusSchema, EmploymentStatus};