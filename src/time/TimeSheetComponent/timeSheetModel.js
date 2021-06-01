const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const {timeSheetActionSchema} = require('../TimeSheetActionComponent/timeSheetActionModel')
const timeSheetSchema = new mongoose.Schema({
    timeSheetWeek: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeSheetWeek',
        required: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['not-submitted', 'submitted', 'approved'],
        default: 'not-submitted',
        trim: true
    },
    actions: [{
        type: timeSheetActionSchema
    }]
}, {versionKey: false, toJSON: {virtuals: true}});
timeSheetSchema.plugin(idValidator);
timeSheetSchema.virtual('tasks', {
    ref: 'TimeSheetTask',
    localField: '_id',
    foreignField: 'timeSheet'
})
const TimeSheet = mongoose.model('TimeSheet', timeSheetSchema);
module.exports = {timeSheetSchema, TimeSheet};