const mongoose = require('mongoose');

const mimeSchema = new mongoose.Schema({
    mime_type: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 100,
        lowercase: true
    },
    source: {
        type: String,
        maxlength: 50,
        lowercase: true,
        trim: true
    },
    compressible: {
        type: Boolean,
    },
    extensions: [{
        type: String,
        maxlength: 50,
        trim: true,
        lowercase: true
    }]
})

const Mime = mongoose.model('Mime', mimeSchema);

module.exports = {
    mimeSchema,
    Mime
}