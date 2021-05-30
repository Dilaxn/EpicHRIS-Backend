const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const moment = require('moment');
const WorkWeekService = require('../../leave/WorkWeekComponent/WorkWeekService');
const workWeekService = new WorkWeekService();
const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    punchInTime: {
        type: Date,
        default: moment().toDate,
        required: true,
        get: (v) => v ? moment(v).format() : undefined
    },
    punchInNote: {
        type: String,
        maxlength: 100
    },
    punchOutTime: {
        type: Date,
        get: (v) => v ? moment(v).format() : undefined
    },
    punchOutNote: {
        type: String,
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['punched-in', 'punched-out'],
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }
}, {versionKey: false, toJSON: {virtuals: true}});
attendanceSchema.plugin(idValidator);
attendanceSchema.set('toJSON', {getters: true});
attendanceSchema.virtual('duration').get(function () {
    const unixPunchIn = moment(this.get('punchInTime', null, {getters: false})).valueOf();
    let unixPunchOut;
    if (this.status === 'punched-out') {
        unixPunchOut = moment(this.get('punchOutTime', null, {getters: false})).valueOf();
    }else {
        unixPunchOut = moment().valueOf();
    }
    const duration = moment.duration(unixPunchOut).subtract(moment.duration(unixPunchIn));
    return duration.asHours();
})

attendanceSchema.pre('save', async function (next) {
    if (this.punchOutTime) {
        const punchInTime = this.get('punchInTime', null, {getters: false});
        const punchOutTime = this.get('punchOutTime', null, {getters: false});
        if (moment(punchInTime).isAfter(moment(punchOutTime))) {
            next(new Error('punch out should be after punch in'));
        }
        const maxTime = await workWeekService.getTotalWorkingDayTime();
        const diff = moment(punchOutTime).valueOf() - moment(punchInTime).valueOf();
        if (diff > maxTime) {
            this.punchOutTime = moment(punchInTime).add(maxTime, 'milliseconds').toDate();
        }
    }
    next();
})
const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = {attendanceSchema, Attendance};