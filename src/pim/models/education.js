const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const educationSchema = new mongoose.Schema({
    level: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EducationLevel',
        required: true
    },
    institute: {
        type: String,
        trim: true,
        maxlength:50,
        minlength: 2,
    },
    specialization: {
        type: String,
        maxlength: 50,
        minlength: 3,
        trim: true
    },
    gpa: {
        type: Number,
        min: 0.0,
        max: 4.0
    },
    start_date: {
        type: Date,
        max: Date.now()
    },
    end_date: {
        type: Date,
        max: Date.now(),
        validate(value) {
            if (value < this.start_date) {
                throw new Error('end date should be greater than start date');
            }
        }
    },
    year: {
        type: Date,
        min: this.start_date,
        max: Date.now()
    },
    custom_fields: {},
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }
});

educationSchema.plugin(idValidator);
educationSchema.set('toObject', {virtuals: true});
educationSchema.set('toJSON', {virtuals: true});
const Education = mongoose.model('Education', educationSchema);

module.exports = {
    educationSchema,
    Education
}

