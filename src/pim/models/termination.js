const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const terminationSchema = new mongoose.Schema({
    reason: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TerminationReason',
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    note: {
        type: String,
        trim: true,
        maxlength: 100
    },
    employee: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }
});

terminationSchema.plugin(idValidator);

const Termination = mongoose.model('Termination', terminationSchema);

module.exports = {
    terminationSchema,
    Termination
}