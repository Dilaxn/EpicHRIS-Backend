const mongoose = require('mongoose');
const timeSheetWeekSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    leavePeriod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LeavePeriod'
    }
});
const TimeSheetWeek = mongoose.model('TimeSheetWeek', timeSheetWeekSchema);
module.exports = {timeSheetWeekSchema, TimeSheetWeek};