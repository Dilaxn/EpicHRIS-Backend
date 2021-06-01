const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const timeSheetTaskSchema = new mongoose.Schema({
    timeSheet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeSheet',
        required: true
    },
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
    allocatedHours: [{
        type: Number,
        max: 8,
        min: 0
    }]
}, {versionKey: false, toJSON: {getters: true}});
timeSheetTaskSchema.plugin(idValidator);
timeSheetTaskSchema.path('allocatedHours').get((v) => v.map((hour, index) => {
    let day;
    switch (index) {
        case 0:
            day = "Monday";
            break;
        case 1:
            day = "Tuesday";
            break;
        case 2:
            day = "Wednesday";
            break;
        case 3:
            day = "Thursday";
            break;
        case 4:
            day = "Friday";
            break;
        case 5:
            day = "Saturday";
            break;
        case 6:
            day = "Sunday"
    }
    return {day, hours: hour}
}));
timeSheetTaskSchema.pre('validate', async function (next) {
    const doc = this;
    if (!doc.allocatedHours || doc.allocatedHours.length === 0) {
        doc.allocatedHours = [0, 0, 0, 0, 0, 0, 0];
    }
    if (doc.allocatedHours.length > 7) {
        next(new Error('allocated hours length can not be more than 7'));
    }
    next();
})
const TimeSheetTask = mongoose.model('TimeSheetTask', timeSheetTaskSchema);
module.exports = {timeSheetTaskSchema, TimeSheetTask};