const mongoose = require('mongoose');
const moment = require('moment');
const leavePeriodSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['past', 'current', 'future'],
        required: true
    }
}, {versionKey: false});
leavePeriodSchema.pre('save', async function(next) {
    const doc = this;
    if (moment(doc.startDate).isAfter(moment(doc.endDate))) {
        next(new Error('start date should be before end date'));
    }
    next();
})
const LeavePeriod = mongoose.model('LeavePeriod', leavePeriodSchema);
module.exports = {
    leavePeriodSchema,
    LeavePeriod
}