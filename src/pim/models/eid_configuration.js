const mongoose = require('mongoose');


const eidConfigurationSchema = new mongoose.Schema({
    prefix: {
        type: String,
        uppercase: true
    },
    suffix: {
        type: String,
        uppercase: true
    },
    number_length: {
        type: Number,
        required: true
    },
    increase_by: {
        type: Number,
        required: true
    },
    highest_number: {
        type: Number,
        required: true
    }
});

const EidConfiguration = mongoose.model('EidConfiguration', eidConfigurationSchema);

module.exports = {
    eidConfigurationSchema,
    EidConfiguration
}