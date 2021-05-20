const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const employeeLicenseSchema = new mongoose.Schema({
    license_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'License',
        required: true
    },
    license_number: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true
    },
    issued_date: {
        type: Date,
        max: Date.now(),
        min: '1950-01-01'
    },
    expiry_date: {
        type: Date,
        validate(value) {
            if (value < this.issued_date) {
                throw new Error('expiry date should be higher than issued date');
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

employeeLicenseSchema.plugin(idValidator);
employeeLicenseSchema.set('toObject', {virtuals: true});
employeeLicenseSchema.set('toJSON', {virtuals: true});
const EmployeeLicense = mongoose.model('EmployeeLicense', employeeLicenseSchema);

module.exports = {
    employeeLicenseSchema,
    EmployeeLicense
}