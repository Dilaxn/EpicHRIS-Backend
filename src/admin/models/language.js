const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
    code: {
        type: String,
        lowercase: true,
        maxlength: 2,
        minlength: 2,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    native_name: {
        type: String,
        trim: true,
        maxlength: 100
    }
});

const Language = mongoose.model('Language', languageSchema);

module.exports = {
    languageSchema,
    Language
}