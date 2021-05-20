const mongoose = require('mongoose');
const leaveTypeSchema = new mongoose.Schema({
    leave_type_name: {
        type: String,
        maxlength: 50,
        required: true,
        trim: true,
        unique: true
    },
    is_entitlement_situational: {
        type: Boolean,
        default: false
    }
});

leaveTypeSchema.set('toJSON', {virtuals: true});
leaveTypeSchema.set('toObject', {virtuals: true});

const LeaveType = mongoose.model('LeaveType', leaveTypeSchema);

module.exports = {
    leaveTypeSchema,
    LeaveType
}