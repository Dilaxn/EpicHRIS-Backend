const mongoose = require('mongoose');
const validator = require('validator');
const idValidator = require('mongoose-id-validator');

const emergencyContactSchema = new mongoose.Schema({
    name: {
        type:String,
        trim: true,
        lowercase: true,
        minlength: 3,
        max: 20,
        required: true
    },
    relationship: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 20,
        required: true
    },
    home_tel: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isMobilePhone(value, 'any')) {
                throw new Error('home telephone number invalid');
            }
        }
    },
    mobile: {
        type: String,
        trim: true,
        validate(value) {
            if (!validator.isMobilePhone(value, 'any')) {
                throw new Error('home telephone number invalid');
            }
        }
    },
    work_tel: {
        type: String,
        trim: true,
        validate(value) {
            if (!validator.isMobilePhone(value, 'any')) {
                throw new Error('home telephone number invalid');
            }
        }
    },
    custom_fields: {},
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }
});

emergencyContactSchema.plugin(idValidator);
emergencyContactSchema.set('toObject', {virtuals: true});
emergencyContactSchema.set("toJSON", {virtuals: true});


const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactSchema);

module.exports = {emergencyContactSchema, EmergencyContact }