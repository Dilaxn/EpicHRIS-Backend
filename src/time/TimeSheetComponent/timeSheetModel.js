const mongoose = require('mongoose');
const {timeSheetActionSchema} = require('../TimeSheetActionComponent/timeSheetActionModel')
const timeSheetSchema = new mongoose.Schema({
    timeSheetWeek: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeSheetWeek',
        required: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeSheetTask'
    }],
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    actions: [{
        type: timeSheetActionSchema
    }]
});
const TimeSheet = mongoose.model('TimeSheet', timeSheetSchema);
module.exports = {timeSheetSchema, TimeSheet};