const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const {leaveDaySchema} = require('../LeaveDayComponent/leaveDayModel')
const leaveSchema = new mongoose.Schema({
    comment: {
        type: String,
        trim: true
    },
    entitlement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entitlement'
    }
}, {versionKey: false});
leaveSchema.plugin(idValidator);
leaveSchema.set('toObject', {virtuals: true});
leaveSchema.set('toJSON', {virtuals: true});

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = {
    leaveSchema,
    Leave
}