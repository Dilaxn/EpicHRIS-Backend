const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const Int32 = require('mongoose-int32');
const moment = require('moment');
const leaveSchema = new mongoose.Schema({
    comment: {
        type: String,
        trim: true
    },
    entitlement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entitlement'
    },
    startDay: {
       type: Date,
       get: (v) => moment(v).format('YYYY-MM-DD')
    },
    endDate: {
        type: Date,
        get: (v) => moment(v).format('YYYY-MM-DD')
    },
    startTime: {
        type: Int32,
        required: true,
        get: (v) => moment.duration(v).hours().toString() + ':' + moment.duration(v).minutes().toString()
    },
    endTime: {
        type: Int32,
        required: true,
        get: (v) => moment.duration(v).hours().toString() + ':' + moment.duration(v).minutes().toString()
    }
}, {versionKey: false});
leaveSchema.plugin(idValidator);
leaveSchema.set('toObject', {virtuals: true});
leaveSchema.set('toJSON', {virtuals: true});
leaveSchema.set("toJSON", {getters: true});

leaveSchema.virtual('leaveDays', {
    ref: 'LeaveDay',
    localField: '_id',
    foreignField: 'leave'
})

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = {
    leaveSchema,
    Leave
}