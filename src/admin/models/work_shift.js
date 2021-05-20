const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const {generateNumberWithLeadingZero} = require('../../pim/models/employee');

const workShiftSchema = new mongoose.Schema({
    shift_name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 100

    },
    work_hours: {
        from: {
            type: Number,
            min: 0,
            max: 86400,
            required: true
        },
        to: {
            type: Number,
            min: 0,
            max: 86400,
            required: true
        }
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }]
});


workShiftSchema.plugin(idValidator);
workShiftSchema.set('toObject', {virtuals: true});
workShiftSchema.set('toJSON', {virtuals: true});

const convertSecondsToTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const hourBalance = seconds % 3600;
    const minutes = Math.floor(hourBalance / 60);
    const secs = hourBalance % 60;

    return generateNumberWithLeadingZero(hours, 2) + ':' + generateNumberWithLeadingZero(minutes, 2) + ':' + generateNumberWithLeadingZero(secs, 2);
}

workShiftSchema.virtual('work_hours_from_readable').get(function (value, virtual, doc) {
    return convertSecondsToTime(this.work_hours.from);
})

workShiftSchema.virtual('work_hours_to_readable').get(function (value, virtual, doc) {
    return convertSecondsToTime(this.work_hours.to);
})

workShiftSchema.pre('save', async function (next) {
    const workShift = this;
    const employees = workShift.employees;
    for (const employee of employees) {
        const existingWorkShift = await WorkShift.find({employees: employee});
        if (existingWorkShift.length > 0) {
            next(new Error(employee + ' is already assign to ' + existingWorkShift[0].shift_name + ' work shift'));
        }
    }

    next()
})

const WorkShift = mongoose.model('WorkShift', workShiftSchema);
module.exports = {
    workShiftSchema,
    WorkShift,
    convertSecondsToTime
}