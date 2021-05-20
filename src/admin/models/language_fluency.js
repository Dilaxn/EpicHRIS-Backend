const mongoose = require('mongoose');


const languageFluencySchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        trim: true,
        maxlength: 50,
        required: true
    }
});

const LanguageFluency = mongoose.model('LanguageFluency', languageFluencySchema);


module.exports = {
    languageFluencySchema,
    LanguageFluency
}