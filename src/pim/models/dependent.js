const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const dependentSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxlength: 20,
        minlength: 3,
        required: true,
        lowercase: true
    },
    relationship: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
        trim: true,
        lowercase: true
    },
    date_of_birth: {
        type: Date,
        max: Date.now(),
        min: '1900-01-01'
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    custom_fields: {}
});

dependentSchema.plugin(idValidator);
dependentSchema.set('toObject', {virtuals: true});
dependentSchema.set('toJSON', {virtuals: true});

const Dependent = mongoose.model('Dependent', dependentSchema);

module.exports = {dependentSchema, Dependent};