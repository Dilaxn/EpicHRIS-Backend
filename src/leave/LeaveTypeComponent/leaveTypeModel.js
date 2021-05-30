const mongoose = require('mongoose');
const {Entitlement} = require('../LeaveEntitlementComponent/leaveEntitlementModel');
const leaveTypeSchema = new mongoose.Schema({
    leaveTypeName: {
        type: String,
        maxlength: 50,
        required: true,
        trim: true,
        unique: true
    },
    isEntitlementSituational: {
        type: Boolean,
        default: false
    }
}, {versionKey: false});
leaveTypeSchema.pre('deleteMany', async function (next) {
    const filter = this.getQuery();
    const leaveTypes = await LeaveType.find(filter);
    if (leaveTypes.length > 0) {
        const defaultLeaveType = await LeaveType.findOne({leaveTypeName: 'deleted'});
        for (const leaveType of leaveTypes) {
            if (leaveType._id.equals(defaultLeaveType._id)) {
                next(new Error('default leave type can not be deleted'));
            }
            await Entitlement.updateMany({leaveType: leaveType._id}, {$set: {leaveType: defaultLeaveType._id}});
        }
    }
    next();
})
leaveTypeSchema.pre('findOneAndDelete', async function (next) {
    const filter = this.getQuery()
    const leaveType = await LeaveType.findOne(filter);
    if (leaveType) {
        const defaultLeaveType = await LeaveType.findOne({leaveTypeName: 'deleted'});
        if (leaveType._id.equals(defaultLeaveType._id)) {
            next(new Error('default leave type can not be deleted'));
        }
        await Entitlement.updateMany({leaveType: leaveType._id}, {$set: {leaveType: defaultLeaveType._id}});
    }
    next();
})
leaveTypeSchema.pre('save', async function(next) {
    const doc = this;
    const defaultLeaveType = await LeaveType.findOne({leaveTypeName: 'deleted'});
    if (defaultLeaveType) {
        if (doc._id.equals(defaultLeaveType._id)) {
            next(new Error('default deleted leave type can not be modified'));
        }
    }
    next();
})
const LeaveType = mongoose.model('LeaveType', leaveTypeSchema);
module.exports = {
    leaveTypeSchema,
    LeaveType
}