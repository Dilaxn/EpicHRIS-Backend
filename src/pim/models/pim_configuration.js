const mongoose = require('mongoose');

const pimConfigurationSchema = new mongoose.Schema({
    show_nick_name: {
        type: Boolean,
        required: true
    },
    show_smoker: {
        type: Boolean,
        required: true
    },
    show_military_service: {
        type: Boolean,
        required: true
    },
    show_ssn: {
        type: Boolean,
        required: true
    },
    show_sin: {
        type: Boolean,
        required: true
    }
});

const PimConfiguration = mongoose.model('PimConfiguration', pimConfigurationSchema);

module.exports = {
    pimConfigurationSchema,
    PimConfiguration
}