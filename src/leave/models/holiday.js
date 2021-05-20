const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
    holiday_name: {
        type: String,
        maxlength: 50,
        required: true,
        trim: true
    },
    holiday_date: {
        type: Date,
        required: true
    },
    is_repeated_annually: {
        type: Boolean
    },
    holiday_type: {
        type: String,
        enum: ['full', 'half'],
        default: 'full'
    }
});

holidaySchema.set('toJSON', {virtuals: true});
holidaySchema.set('toObject', {virtuals: true});

const Holiday = mongoose.model('Holiday', holidaySchema);
module.exports = {
    holidaySchema,
    Holiday
}