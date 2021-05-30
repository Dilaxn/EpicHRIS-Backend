const mongoose = require('mongoose');
const workWeekSchema = new mongoose.Schema({
    sunday: {
        type: String,
        enum: ['full', 'half-M', 'half-E', 'non']
    },
    monday: {
        type: String,
        enum: ['full', 'half-M', 'half-E', 'non']
    },
    tuesday: {
        type: String,
        enum: ['full', 'half-M', 'half-E', 'non']
    },
    wednesday: {
        type: String,
        enum: ['full', 'half-M', 'half-E', 'non']
    },
    thursday: {
        type: String,
        enum: ['full', 'half-M', 'half-E', 'non']
    },
    friday: {
        type: String,
        enum: ['full', 'half-M', 'half-E', 'non']
    },
    saturday: {
        type: String,
        enum: ['full', 'half-M', 'half-E', 'non']
    }
}, {versionKey: false});
const WorkWeek = mongoose.model('WorkWeek', workWeekSchema);
module.exports = {
    workWeekSchema,
    WorkWeek
}
