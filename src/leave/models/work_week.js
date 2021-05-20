const mongoose = require('mongoose');
const workWeekSchema = new mongoose.Schema({
    monday: {
        type: String,
        enum: ['full', 'half', 'non-working'],
        lowercase: true,
        trim: true,
        default: 'full'
    },
    tuesday: {
        type: String,
        enum: ['full', 'half', 'non-working'],
        lowercase: true,
        trim: true,
        default: 'full'
    },
    wednesday: {
        type: String,
        enum: ['full', 'half', 'non-working'],
        lowercase: true,
        trim: true,
        default: 'full'
    },
    thursday: {
        type: String,
        enum: ['full', 'half', 'non-working'],
        lowercase: true,
        trim: true,
        default: 'full'
    },
    friday: {
        type: String,
        enum: ['full', 'half', 'non-working'],
        lowercase: true,
        trim: true,
        default: 'full'
    },
    saturday: {
        type: String,
        enum: ['full', 'half', 'non-working'],
        lowercase: true,
        trim: true,
        default: 'non-working'
    },
    sunday: {
        type: String,
        enum: ['full', 'half', 'non-working'],
        lowercase: true,
        trim: true,
        default: 'non-working'
    },
});

workWeekSchema.set('toObject', {virtuals: true});
workWeekSchema.set('toJSON', {virtuals: true});

const WorkWeek = mongoose.model('WorkWeek', workWeekSchema);
module.exports = {
    workWeekSchema,
    WorkWeek
}