const mongoose = require('mongoose');
const {Employee} = require('../../pim/models/employee');


const nationalitySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        maxlength: 30
    }
});

nationalitySchema.pre('remove', async function (next) {
    const nationality = this;
    const employees = await Employee.find({nationality: nationality._id}).select('nationality');
    if (employees.length > 0) {
        for (const employee of employees) {
            employee.nationality = undefined;
            await employee.save();
        }
    }

    next();
})

const Nationality = mongoose.model('Nationality', nationalitySchema);

module.exports = {
    nationalitySchema,
    Nationality
}