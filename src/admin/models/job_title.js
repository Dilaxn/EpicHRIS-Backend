const mongoose = require('mongoose');
const {Job} = require('../../pim/models/job');
const {EmployeeReport} = require('../../pim/models/employee_report');

const jobTitleSchema = new mongoose.Schema({
    job_title: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true,
        lowercase: true
    },
    job_description: {
        type: String,
        maxlength: 500,
        trim: true
    },
    job_specification: {
        file: {
            type: Buffer
        },
        fileName: {
            type: String
        }
    },
    note: {
        type: String,
        maxlength: 200,
        trim: true
    }
})

jobTitleSchema.pre('remove', async function (next) {
    const jobTitle = this;
    const jobs = await Job.find({job_title: jobTitle._id});
    if (jobs.length > 0) {
        for (const job of jobs) {
            job.job_title = undefined;
            await job.save();
        }
    }

    const reports = await EmployeeReport.find({'selected_criteria.job_title': jobTitle._id});
    if (reports.length > 0) {
        for (const report of reports) {
            report.selected_criteria.job_title = undefined;
            await report.save();
        }
    }

    next();
})

const JobTitle = mongoose.model('JobTitle', jobTitleSchema);

module.exports = {
    jobTitleSchema,
    JobTitle
}