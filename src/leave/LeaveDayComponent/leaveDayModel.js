const mongoose = require('mongoose');
const int32 = require('mongoose-int32');
const leaveDaySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    timeFrom: {
        type: int32,
        min: 0,
        max: 86399,
        required: true
    },
    timeTo: {
        type: int32,
        min: 0,
        max: 86399,
        required: true
    },
    status: {
        type: String,
        enum: ['rejected', 'cancelled', 'pending-approval', 'approved', 'taken', 'weekend', 'holiday'],
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    leave: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Leave'
    },
    entitlement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entitlement'
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }
}, {versionKey: false});

leaveDaySchema.set('toJSON', {virtuals: true});
leaveDaySchema.set('toObject', {virtuals: true});
const LeaveDay = mongoose.model('LeaveDay', leaveDaySchema);
module.exports = {
    leaveDaySchema,
    LeaveDay
}