const mongoose = require('mongoose');

const languageCompetencySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
        lowercase: true
    }
});


const LanguageCompetency = mongoose.model('LanguageCompetency', languageCompetencySchema);
module.exports = {
    languageCompetencySchema,
    LanguageCompetency
}