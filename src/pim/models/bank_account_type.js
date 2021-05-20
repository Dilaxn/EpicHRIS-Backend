const mongoose = require('mongoose');
const {SalaryComponent} = require('../models/salary_component');

const bankAccountTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 30,
        lowercase: true
    }
});

bankAccountTypeSchema.pre('remove', async function (next) {
    const bankAccountType = this;
    const salaryComponents = await SalaryComponent.find({'deposit_detail.account_type': bankAccountType._id});
    if (salaryComponents.length > 0) {
        for (const salaryComponent of salaryComponents) {
            salaryComponent.deposit_detail.account_type = undefined;
            await salaryComponent.save();
        }
    }

    next();
})
const BankAccountType = mongoose.model('BankAccountType', bankAccountTypeSchema);

module.exports = {
    bankAccountTypeSchema,
    BankAccountType
}