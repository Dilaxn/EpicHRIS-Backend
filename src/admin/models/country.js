const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    code: {
        type: String,
        unique: true,
        required: true,
        minlength: 2,
        maxlength: 2,
        uppercase: true
    }
});


countrySchema.virtual('immigrations', {
    ref: 'Immigration',
    localField: '_id',
    foreignField: 'issued_by'
});

const Country = mongoose.model('Country', countrySchema);

module.exports = { countrySchema, Country };