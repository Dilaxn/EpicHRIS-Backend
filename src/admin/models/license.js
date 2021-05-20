const mongoose = require('mongoose');
const {EmployeeLicense} = require('../../pim/models/employee_license');

const licenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 50,
        minlength: 2
    }
});

licenseSchema.pre('remove', async function (next) {
    const licenseType = this;
    const employeeLicenses = await EmployeeLicense.find({license_type: licenseType._id});
    if (employeeLicenses.length > 0) {
        for (const employeeLicense of employeeLicenses) {
            await employeeLicense.remove();
        }
    }
})
const License = mongoose.model('License', licenseSchema);

module.exports = {
    licenseSchema,
    License
}