const mongoose = require('mongoose');
const {SalaryComponent} = require('../models/salary_component');

const payFrequencySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 30,
        trim: true,
        minlength: 2
    }
});

payFrequencySchema.pre('remove', async function (next) {
    const  payFrequency = this;
    const salaryComponents = await SalaryComponent.find({pay_frequency: payFrequency._id});
    if (salaryComponents.length > 0) {
        for (const salaryComponent of salaryComponents) {
            salaryComponent.pay_frequency = undefined;
            await salaryComponent.save();
        }
    }


    next();
})
const PayFrequency = mongoose.model('PayFrequency', payFrequencySchema);

module.exports = {
    payFrequencySchema,
    PayFrequency
}