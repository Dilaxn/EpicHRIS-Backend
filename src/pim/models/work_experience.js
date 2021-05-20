const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const workExperienceSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
        minlength: 2
    },
    title_of_job: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 30
    },
    from: {
        type: Date,
        max: Date.now(),
        min: '1950-01-01'
    },
    to: {
        type: Date,
        max: Date.now(),
        validate(value) {
            if (value <= this.from) {
                throw new Error('date should be grater than from');
            }
        }
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 100
    },
    custom_fields: {},
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }
});

workExperienceSchema.plugin(idValidator);
workExperienceSchema.set('toObject', {virtuals: true});
workExperienceSchema.set('toJSON', {virtuals: true});
const WorkExperience = mongoose.model('WorkExperience', workExperienceSchema);

module.exports = {
    workExperienceSchema,
    WorkExperience
}