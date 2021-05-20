const mongoose = require('mongoose');
const {ReportTo} = require('../models/report_to');


const reportingMethodSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true
    }
})

reportingMethodSchema.pre('remove', async function (next) {
    const reportingMethod = this;
    const reportTos = await ReportTo.find({method: reportingMethod._id});
    if (reportTos.length > 0) {
        reportTos.forEach((reportTo) => {
            reportTo.remove();
        })
    }

    next();
})

const ReportingMethod = mongoose.model('ReportingMethod', reportingMethodSchema);

module.exports = {
    reportingMethodSchema,
    ReportingMethod
}