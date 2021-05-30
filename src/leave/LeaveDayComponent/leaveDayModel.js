const mongoose = require('mongoose');
const int32 = require('mongoose-int32');
const moment = require('moment');
const leaveDaySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        get: (v) => moment(v).format('YYYY-MM-DD')
    },
    timeFrom: {
        type: int32,
        required: true,
        get: (v) => moment.duration(v).hours().toString() + ':' + moment.duration(v).minutes().toString()
    },
    timeTo: {
        type: int32,
        required: true,
        get: (v) => moment.duration(v).hours().toString() + ':' + moment.duration(v).minutes().toString()
    },
    status: {
        type: String,
        enum: ['rejected', 'cancelled', 'pending-approval', 'taken', 'scheduled'],
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    leave: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Leave',
        required: true
    },
    entitlement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entitlement',
        required: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }
}, {versionKey: false});

leaveDaySchema.set('toJSON', {virtuals: true});
leaveDaySchema.set('toObject', {virtuals: true});
leaveDaySchema.set('toJSON', {getters: true});
const LeaveDay = mongoose.model('LeaveDay', leaveDaySchema);
module.exports = {
    leaveDaySchema,
    LeaveDay
}