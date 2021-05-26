const mongoose = require('mongoose');
const holidaySchema = new mongoose.Schema({
    holidayName: {
        type: String,
        maxlength: 50,
        required: true,
        trim: true
    },
    holidayDate: {
        type: Date,
        required: true
    },
    isRepeatedAnnually: {
        type: Boolean,
        required: true,
        default: false
    },
    holidayType: {
        type: String,
        enum: ['full', 'half'],
        required: true,
        default: 'full'
    }
}, {versionKey: false});
const Holiday = mongoose.model('Holiday', holidaySchema);
module.exports = {
    holidaySchema,
    Holiday
}