const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const moment = require('moment');
const workDayConfigurationSchema = new mongoose.Schema({
    halfMorning: {
        from: {
            type: Int32,
            required: true
        },
        to: {
            type: Int32,
            required: true
        }
    },
    halfEvening: {
        from: {
            type: Int32,
            required: true
        },
        to: {
            type: Int32,
            required: true
        }
    }
}, {versionKey: false, _id: false});
workDayConfigurationSchema.pre('validate', function (next) {
    const doc = this;
    const minDuration = moment.duration(0).asMilliseconds();
    const maxDuration = moment.duration(1, 'day').asMilliseconds();
    const MS = doc.halfMorning.from;
    const ME = doc.halfMorning.to;
    const ES = doc.halfEvening.from;
    const EE = doc.halfEvening.to;
    if (!(MS > minDuration && MS < maxDuration && MS < ME && MS < ES && MS < EE)) {
        next(new Error('morning start time validation failed'));
    }
    if (!(ME > minDuration && ME < maxDuration && ME > MS && ME < ES && ME < EE)) {
        next(new Error('morning end time validation failed'));
    }
    if (!(ES > minDuration && ES < maxDuration && ES > MS && ES > ME && ES < EE)) {
        next(new Error('evening start time validation failed'));
    }
    if (!(EE > minDuration && EE < maxDuration && EE > MS && EE > ME && EE > ES)) {
        next(new Error('evening end time validation failed'));
    }
    next()
});
const WorkDayConfiguration = mongoose.model('WorkDayConfiguration', workDayConfigurationSchema);
module.exports = {
    workDayConfigurationSchema,
    WorkDayConfiguration
}