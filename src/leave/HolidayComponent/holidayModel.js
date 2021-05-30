const mongoose = require('mongoose');
const moment = require('moment');
const holidaySchema = new mongoose.Schema({
    holidayName: {
        type: String,
        maxlength: 50,
        required: true,
        trim: true
    },
    holidayDate: {
        type: Date,
        required: true,
        get: (v) => moment(v).format('YYYY-MM-DD'),
        set: (v) => moment(v, 'YYYY-MM-DD').toDate()
    },
    isRepeatedAnnually: {
        type: Boolean,
        required: true,
        default: false
    },
    holidayType: {
        type: String,
        enum: ['full', 'half-M', 'half-E'],
        required: true,
        default: 'full'
    }
}, {versionKey: false});
holidaySchema.set('toObject', {getters: true});
holidaySchema.set('toJSON', {getters: true})
const Holiday = mongoose.model('Holiday', holidaySchema);
module.exports = {
    holidaySchema,
    Holiday
}