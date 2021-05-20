const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const {SalaryComponent} = require('../../pim/models/salary_component');

const payGradeCurrencySchema = new mongoose.Schema({
    currency_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Currency',
        required: true
    },
    min_salary: {
        type: Number,
        default: 0.0,
        min: 0
    },
    max_salary: {
        type: Number,
        default: 0.0,
        min: 0
    },
    pay_grade: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PayGrade',
        required: true
    }
});
payGradeCurrencySchema.plugin(idValidator);

payGradeCurrencySchema.pre('remove', async function (next) {
    const payGradeCurrency = this;
    const salaryComponents = await SalaryComponent.find({currency: payGradeCurrency._id});
    if (salaryComponents.length > 0) {
        for (const salaryComponent of salaryComponents) {
            salaryComponent.remove();
        }
    }

    next();
})

const PayGradeCurrency = mongoose.model('PayGradeCurrency', payGradeCurrencySchema);

module.exports = {
    payGradeCurrencySchema,
    PayGradeCurrency
}