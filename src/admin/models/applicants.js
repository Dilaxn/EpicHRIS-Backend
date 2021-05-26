const mongoose = require('mongoose');
// const {Job} = require('../../pim/models/job');
// const {EmployeeReport} = require('../../pim/models/employee_report');

const applicantSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true,
        lowercase: true
    },
    last_name: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true,
        lowercase: true
    },
    street: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true,
        lowercase: true
    },
    city: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true,
        lowercase: true
    },
    postal_code: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true,
        lowercase: true
    },
    country: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true,
        lowercase: true
    },
    hiring_manager: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true,
        lowercase: true
    },
    manager_id: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true,
        lowercase: true
    },
})

// jobTitleSchema.pre('remove', async function (next) {
//     const jobTitle = this;
//     const jobs = await Job.find({job_title: jobTitle._id});
//     if (jobs.length > 0) {
//         for (const job of jobs) {
//             job.job_title = undefined;
//             await job.save();
//         }
//     }
//
//     const reports = await EmployeeReport.find({'selected_criteria.job_title': jobTitle._id});
//     if (reports.length > 0) {
//         for (const report of reports) {
//             report.selected_criteria.job_title = undefined;
//             await report.save();
//         }
//     }
//
//     next();
// })

const Applicant = mongoose.model('Applicant', applicantSchema);

module.exports = {
    applicantSchema,
    Applicant
}