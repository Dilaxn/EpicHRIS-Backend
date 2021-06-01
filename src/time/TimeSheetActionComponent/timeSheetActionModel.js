const mongoose = require('mongoose');
const moment = require('moment');
const idValidator = require('mongoose-id-validator');
const timeSheetActionSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: ['updated', 'submitted', 'approved', 'rejected', 'reset']
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    dateOfAction: {
        type: Date,
        default: moment().toDate(),
        required: true
    },
    comment: {
        type: String,
        maxlength: 500
    }
}, {versionKey: false});
timeSheetActionSchema.plugin(idValidator);
const TimeSheetAction = mongoose.model('TimeSheetAction', timeSheetActionSchema);
module.exports = {timeSheetActionSchema, TimeSheetAction};
