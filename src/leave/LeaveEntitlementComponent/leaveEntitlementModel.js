const  mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const entitlementSchema = new mongoose.Schema({
    leaveType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LeaveType',
        required: true
    },
    leavePeriod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LeavePeriod',
        required: true
    },
    entitlement: {
        type: Number,
        max: 365,
        min: 1,
        required: true
    },
    leaveTaken: {
        type: Number,
        default: 0,
        min: 0
    },
    employee : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }
}, {versionKey: false});
entitlementSchema.plugin(idValidator);
entitlementSchema.set('toObject', {virtuals: true});
entitlementSchema.pre('save', async function (next) {
    const doc = this;
    if (doc.leaveTaken > doc.entitlement) {
        next(new Error('leave taken exceeds entitlement'));
    }
    next();
})
const Entitlement = mongoose.model('Entitlement', entitlementSchema);
module.exports = {
    entitlementSchema,
    Entitlement
}