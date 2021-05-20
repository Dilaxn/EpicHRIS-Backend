const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const employeeLanguageSchema = new mongoose.Schema({
    language: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language',
        required: true
    },
    fluency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LanguageFluency',
        required: true
    },
    competency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LanguageCompetency',
        required: true
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 100
    },
    custom_fields: {},
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }
});

employeeLanguageSchema.plugin(idValidator);
employeeLanguageSchema.set('toObject', {virtuals: true});
employeeLanguageSchema.set('toJSON', {virtuals: true});

const EmployeeLanguage = mongoose.model('EmployeeLanguage', employeeLanguageSchema);

module.exports = {
    employeeLanguageSchema,
    EmployeeLanguage
}