const mongoose = require('mongoose');
const workWeekSchema = new mongoose.Schema({
    sunday: {
        type: String,
        enum: ['full', 'half', 'non'],
    },
    monday: {
        type: String,
        enum: ['full', 'half', 'non'],
    },
    tuesday: {
        type: String,
        enum: ['full', 'half', 'non'],
    },
    wednesday: {
        type: String,
        enum: ['full', 'half', 'non'],
    },
    thursday: {
        type: String,
        enum: ['full', 'half', 'non'],
    },
    friday: {
        type: String,
        enum: ['full', 'half', 'non'],
    },
    saturday: {
        type: String,
        enum: ['full', 'half', 'non'],
    }
}, {versionKey: false});
const WorkWeek = mongoose.model('WorkWeek', workWeekSchema);
module.exports = {
    workWeekSchema,
    WorkWeek
}
