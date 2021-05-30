const mongoose = require('mongoose');
const timeSheetActionSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: ['submitted', 'approved', 'rejected', 'reset']
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    dateOfAction: {
        type: Date,
        default: Date.now,
        required: true
    },
    comment: {
        type: String
    }
});
const TimeSheetAction = mongoose.model('TimeSheetAction', timeSheetActionSchema);
module.exports = {timeSheetActionSchema, TimeSheetAction};
