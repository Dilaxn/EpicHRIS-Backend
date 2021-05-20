const mongoose = require('mongoose');
const {Job} = require('../../pim/models/job');

const jobCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 30,
        trim: true,
        required: true,
        lowercase: true,
        unique: true
    }
});

jobCategorySchema.pre('remove', async function (next) {
    const jobCategory = this;
    const jobs = await Job.find({job_category: jobCategory._id});
    if (jobs.length > 0) {
        for (const job of jobs) {
            job.job_category = undefined;
            await job.save();
        }
    }

    next();
})

const JobCategory = mongoose.model('JobCategory', jobCategorySchema);

module.exports = {jobCategorySchema, JobCategory};