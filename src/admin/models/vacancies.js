const mongoose = require('mongoose');
// const {Job} = require('../../pim/models/job');
// const {EmployeeReport} = require('../../pim/models/employee_report');

const vacancySchema = new mongoose.Schema({
    vacancy_title: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true,
        lowercase: true
    },
    hiring_manager:{
        type: String,
        required: true,
        maxlength: 50,
    },
hiring_manager_id:{
    type: String,
    required: true,
    maxlength: 50,
},
    vacancy_description: {
        type: String,
        maxlength: 500,
        trim: true,
        required:true
    }
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

const Vacancy = mongoose.model('Vacancy', vacancySchema);

module.exports = {
    vacancySchema,
    Vacancy
}