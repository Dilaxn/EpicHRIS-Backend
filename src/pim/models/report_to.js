const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator')

const reportToSchema = new mongoose.Schema({
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    subordinate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    method: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReportingMethod',
        required: true
    },
    custom_fields: {}
});
reportToSchema.plugin(idValidator);
const ReportTo = mongoose.model('ReportTo', reportToSchema);

module.exports = {reportToSchema, ReportTo}