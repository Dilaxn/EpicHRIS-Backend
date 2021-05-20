const {payGradeSchema} = require('./pay_grade');
const {SalaryComponent} = require('../../pim/models/salary_component');
const {EmployeeReport} = require('../../pim/models/employee_report');

payGradeSchema.pre('remove', async function (next) {
    const payGrade = this;
    const salaryComponents = await SalaryComponent.find({pay_grade: payGrade._id});
    if (salaryComponents.length > 0) {
        for (const salaryComponent of salaryComponents) {
            salaryComponent.remove();
        }
    }

    const reports = await EmployeeReport.find({'selected_criteria.pay_grade': payGrade._id});
    if (reports.length > 0) {
        for (const report of reports) {
            report.selected_criteria.pay_grade = undefined;
            await report.save()
        }
    }

    next();
})