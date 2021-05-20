const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const {PayGrade} = require('../../admin/models/pay_grade');

const salaryComponentSchema = new mongoose.Schema({
    pay_grade: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PayGrade',
        required: true
    },
    salary_component: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 30,
        minlength: 2,
        required: true
    },
    pay_frequency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PayFrequency'
    },
    currency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PayGradeCurrency',
        required: true
    },
    amount: {
        type: Number,
        min: 0,
        required: true
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 100
    },
    deposit_detail: {
        account_number: {
            type: String,
            trim: true,
            minlength: 3,
            maxlength: 20
        },
            account_type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BankAccountType'
        },
        routing_number: {
            type: String,
            trim: true,
            minlength: 3,
            maxlength: 20
        },
        amount: {
            type: Number,
            min: 0
        }
    },
    custom_fields: {},
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }
});

salaryComponentSchema.plugin(idValidator);
salaryComponentSchema.set('toObject', {virtuals: true});
salaryComponentSchema.set('toJSON', {virtuals: true});


salaryComponentSchema.pre('save', async function(next) {
    const salaryComponent = this;
    if (salaryComponent.pay_grade) {
        const payGrade = await PayGrade.findById(salaryComponent.pay_grade).populate({
            path: 'pay_grade_currencies'
        });

        if (payGrade && payGrade.pay_grade_currencies.length > 0) {
            if (salaryComponent.currency) {
                let isValidCurrency = false;
                let currency;
                for (const payGradeCurrency of payGrade.pay_grade_currencies) {
                    if (payGradeCurrency._id.toString() === salaryComponent.currency.toString()) {
                        isValidCurrency = true;
                        currency = payGradeCurrency;
                        break;
                    }
                }

                if (!isValidCurrency) {
                    next(new Error('currency is invalid')) ;
                }

                if (salaryComponent.amount) {
                    if (salaryComponent.amount < currency.min_salary || salaryComponent.amount > currency.max_salary) {
                        next(new Error('amount should be between ' + currency.min_salary + ' and ' + currency.max_salary)) ;
                    }
                }

            }
        }
    }

    next();

})

const SalaryComponent = mongoose.model('SalaryComponent', salaryComponentSchema);

module.exports = {
    salaryComponentSchema,
    SalaryComponent
}