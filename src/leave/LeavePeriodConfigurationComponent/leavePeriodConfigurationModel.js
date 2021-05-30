const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const leavePeriodConfigurationSchema = new mongoose.Schema({
    startMonth: {
        type: String,
        enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    },
    startDay: {
        type: Int32
    }

});
const LeavePeriodConfiguration = mongoose.model('LeavePeriodConfiguration', leavePeriodConfigurationSchema);
module.exports = {
    leavePeriodConfigurationSchema,
    LeavePeriodConfiguration
}