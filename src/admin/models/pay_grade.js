const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
// const {SalaryComponent} = require('../../pim/models/salary_component');
// const {EmployeeReport} = require('../../pim/models/employee_report');


const payGradeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 30,
        trim: true,
        minlength: 2
    }
});

payGradeSchema.virtual('pay_grade_currencies', {
    ref: 'PayGradeCurrency',
    localField: '_id',
    foreignField: 'pay_grade'
});
payGradeSchema.plugin(idValidator);
payGradeSchema.set('toObject', {virtuals: true});
payGradeSchema.set('toJSON', {virtuals: true});

// payGradeSchema.pre('remove', async function (next) {
//     const payGrade = this;
//     const salaryComponents = await SalaryComponent.find({pay_grade: payGrade._id});
//     if (salaryComponents.length > 0) {
//         for (const salaryComponent of salaryComponents) {
//             salaryComponent.remove();
//         }
//     }
//
//     const reports = await EmployeeReport.find({'selected_criteria.pay_grade': payGrade._id});
//     if (reports.length > 0) {
//         for (const report of reports) {
//             report.selected_criteria.pay_grade = undefined;
//             await report.save()
//         }
//     }
//
//     next();
// })
const PayGrade = mongoose.model('PayGrade', payGradeSchema);

module.exports = {
    payGradeSchema,
    PayGrade
}