const mongoose = require('mongoose');
const {Termination} = require('../models/termination');

const terminationReasonSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        maxlength: 50
    }
});

terminationReasonSchema.pre('remove', async function (next) {
    const terminationReason = this;
    if (terminationReason.name === 'other') {
        throw new Error('Termination reason can not be deleted');
    }
    const terminations = await Termination.find({reason: terminationReason._id});
    if (terminations.length > 0) {
        let other = await TerminationReason.findOne({name: 'other'});
        if (!other) {
             other = new TerminationReason({
                name: 'other'
            });

            await other.save();
        }
        for (const termination of terminations) {
            termination.reason = other._id;
            await termination.save();
        }
    }

    next();
})
const TerminationReason = mongoose.model('TerminationReason', terminationReasonSchema);

module.exports = {
    terminationReasonSchema,
    TerminationReason
}