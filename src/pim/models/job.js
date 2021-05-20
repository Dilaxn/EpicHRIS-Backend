const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const jobSchema = new mongoose.Schema({
    job_title: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobTitle'
    },
    employment_status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmploymentStatus'
    },
    job_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobCategory'
    },
    joined_date: {
        type: Date,
        max: Date.now(),
        min: '1950-01-01',
        default: Date.now
    },
    sub_unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationUnit'
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationLocation'
    },
    contract: {
        start_date: {
            type: Date,
            default: Date.now()
        },
        end_date: {
            type: Date
        },
        detail: {
            file: {
                type: Buffer
            },
            file_name: {
                type: String
            }
        }
    },
    custom_fields: {},
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }
},{
    timestamps: true
});

jobSchema.plugin(idValidator);
jobSchema.set('toObject', {virtuals: true});
jobSchema.set('toJSON', {virtuals: true});

const Job = mongoose.model('Job', jobSchema);
module.exports = {jobSchema, Job};