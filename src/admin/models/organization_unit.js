const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const {Job} = require('../../pim/models/job');
const {EmployeeReport} = require('../../pim/models/employee_report');

const organizationUnitSchema = new mongoose.Schema({
    unit_id: {
        type: String,
        trim: true,
        maxlength: 20,
        minlength: 1,
        required: true,
        unique: true
    },
    name: {
        type: String,
        trim: true,
        minlength: 1,
        maxlength: 30,
        lowercase: true,
        required: true,
        unique: true
    },
    description: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationUnit'
    },
    level: {
        type: Number,
        required: true,
        min: 0
    },
    my_children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationUnit',
        autopopulate: {select: 'unit_id name description parent level'}
    }]
});

organizationUnitSchema.plugin(idValidator);
organizationUnitSchema.plugin(require('mongoose-autopopulate'));

organizationUnitSchema.pre('remove', async function (next) {
    const organizationUnit = this;
    const jobs = await Job.find({sub_unit: organizationUnit._id});
    if (jobs.length > 0) {
        for (const job of jobs) {
            job.sub_unit = undefined;
            await job.save();
        }
    }

    const reports = await EmployeeReport.find({'selected_criteria.sub_unit': organizationUnit._id});
    if (reports.length > 0) {
        for (const report of reports) {
            report.selected_criteria.sub_unit = undefined;
            await report.save();
        }
    }

    next();
})

const OrganizationUnit = mongoose.model('OrganizationUnit', organizationUnitSchema);

module.exports = {organizationUnitSchema, OrganizationUnit}