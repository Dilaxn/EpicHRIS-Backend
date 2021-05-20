const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const employeeMembershipSchema = new mongoose.Schema({
    membership: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Membership',
        required: true
    },
    subscription_paid_by: {
        type: String,
        lowercase: true,
        enum: ['company', 'individual']
    },
    subscription_amount: {
        type: Number,
        min: 0,
        validate(value) {
            this.subscription_amount = value.toFixed(2);
        }
    },
    currency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Currency'
    },
    commence_date: {
        type: Date,
        min: '1970-01-01',
        max: '2100-01-01'
    },
    renewal_date: {
        type: Date,
        validate(value) {
            if (value < this.commence_date) {
                throw new Error('renewal date should be higher than commence data');
            }
        },
        max: '2100-01-01'
    },
    custom_fields: {},
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }
});

employeeMembershipSchema.plugin(idValidator);
employeeMembershipSchema.set('toObject', {virtuals: true});
employeeMembershipSchema.set('toJSON', {virtuals: true});

const EmployeeMembership = mongoose.model('EmployeeMembership', employeeMembershipSchema);

module.exports = {
    employeeMembershipSchema,
    EmployeeMembership
}
