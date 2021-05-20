const mongoose = require('mongoose');
const localeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    local: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    tag: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    lcid: {
        type: String,
        trim: true
    },
    iso639_2: {
        type: String,
        trim: true
    },
    iso639_1: {
        type: String,
        trim: true
    }
});

const Locale = mongoose.model('Locale', localeSchema);

module.exports = {
    localeSchema,
    Locale
}