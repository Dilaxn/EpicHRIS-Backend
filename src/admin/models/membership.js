const mongoose = require('mongoose');
const {EmployeeMembership} = require('../../pim/models/employee-membership');

const membershipSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100,
        minlength: 2,
        trim: true
    }
});

membershipSchema.pre('remove', async function (next) {
    const membershipType = this;
    const employeeMemberships = await EmployeeMembership.find({membership: membershipType._id});
    if (employeeMemberships.length > 0) {
        for (const employeeMembership of employeeMemberships) {
            await employeeMembership.remove();
        }
    }
})
const Membership = mongoose.model('Membership', membershipSchema);

module.exports = {
    membershipSchema,
    Membership
}