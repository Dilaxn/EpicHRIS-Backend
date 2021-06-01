const moment = require('moment');
const mongoose = require('mongoose');
const timeSheetWeekSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true,
        get: (v) => v ? moment(v).format() : undefined
    },
    endDate: {
        type: Date,
        required: true,
        get: (v) => v ? moment(v).format() : undefined
    }
}, {versionKey: false, toJSON: {getters: true, virtuals: true}});
timeSheetWeekSchema.virtual('days').get(function () {
    const days = [];
    const start = this.get('startDate', null, {getters: false});
    const end = this.get('endDate', null, {getters: false});
    const temp = moment(start);
    while (temp.day() !== moment(end).day()) {
        days.push({
            date: temp.format('YYYY-MM-DD'),
            day: temp.format('dddd')
        })
        temp.add(1, "day");
    }
    days.push({
        date: temp.format('YYYY-MM-DD'),
        day: temp.format('dddd')
    })
    return days;
})
const TimeSheetWeek = mongoose.model('TimeSheetWeek', timeSheetWeekSchema);
module.exports = {timeSheetWeekSchema, TimeSheetWeek};