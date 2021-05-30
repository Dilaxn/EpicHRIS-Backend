const mongoose = require('mongoose');
const timeSheetTaskSchema = new mongoose.Schema({
    projectName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectActivity',
        required: true
    },
    allocatedHours: {
        type: [Number],
        validate(val) {
            if (val.length > 7) {
                throw new Error('allocated-hours array exceeds limit of 7 elements');
            }
        }
    }
});
const TimeSheetTask = mongoose.model('TimeSheetTask', timeSheetTaskSchema);
module.exports = {timeSheetTaskSchema, TimeSheetTask};