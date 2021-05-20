const express = require('express');
require('./db/mongoose');
const cors = require('cors');
const morgan = require("morgan");
const employeeRouter = require('./src/pim/routers/employee');
const userRouter = require('./src/admin/routers/user');
const adminRouter = require('./src/admin/routers/admin');
const jobTitleRouter = require('./src/admin/routers/job_title');
const employmentStatusRouter = require('./src/admin/routers/employment_status');
const jobCategoryRouter = require('./src/admin/routers/job_category');
const organizationUnitRouter = require('./src/admin/routers/organization_unit');
const locationRouter = require('./src/admin/routers/location');
const countryRouter = require('./src/admin/routers/country');
const terminationReasonRouter = require('./src/pim/routers/termination_reason');
const payGradeRouter = require('./src/admin/routers/pay_grade');
const currencyRouter = require('./src/admin/routers/currency');
const payGradeCurrencyRouter = require('./src/admin/routers/pay_grade_currency');
const payFrequencyRouter = require('./src/pim/routers/pay_frequency');
const bankAccountTypeRouter = require('./src/pim/routers/bank_account_type');
const educationLevelRouter = require('./src/admin/routers/education_level');
const skillRouter = require('./src/admin/routers/skill');
const languageRouter = require('./src/admin/routers/language');
const languageFluencyRouter = require('./src/admin/routers/language_fluency');
const languageCompetencyRouter = require('./src/admin/routers/language_competency');
const licenseRouter = require('./src/admin/routers/license');
const membershipRouter = require('./src/admin/routers/membership');
const pimConfigurationRouter = require('./src/pim/routers/pim_configuration');
const eidConfigurationRouter = require('./src/pim/routers/eid_configuration');
const nationalityRouter = require('./src/admin/routers/nationality');
const reportingMethodRouter = require('./src/pim/routers/reporting_method');
const localeRouter = require('./src/admin/routers/locale');
const customFieldRouter = require('./src/pim/routers/custom_field');
const employeeReportRouter = require('./src/pim/routers/employee_report');
const workShiftRouter = require('./src/admin/routers/work_shift');
const organizationRouter = require('./src/admin/routers/organization');
const leavePeriodRouter = require('./src/leave/routers/leave_period');
const leaveTypeRouter = require('./src/leave/routers/leave_type');
const workWeekRouter = require('./src/leave/routers/work_week');
const holidayRouter = require('./src/leave/routers/holiday');

// const chatRouter = require('./src/admin/routers/chat');
const productRoutes = require("./src/image/controllers/ProfilePic");

// const testRouter = require('./playground/test');


const app = express();
const port = process.env.PORT || 8080;
const http = require('http').createServer(app)
// const io = require('socket.io')(http)
//
//
//
// io.on('connection', socket => {
//     socket.on('message', ({ name, message }) => {
//         io.emit('message', { name, message })
//     })
// })

app.use(express.json());
app.use(cors())
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.status(400).send({ status: 404, message: err.message }); // Bad request
    }
    next();
});
app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use("/products", productRoutes);
app.use(employeeRouter);
app.use(userRouter);
app.use(adminRouter);
app.use(jobTitleRouter);
app.use(employmentStatusRouter);
app.use(jobCategoryRouter);
app.use(organizationUnitRouter);
app.use(locationRouter);
app.use(countryRouter);
app.use(terminationReasonRouter);
app.use(payGradeRouter);
app.use(currencyRouter);
app.use(payGradeCurrencyRouter);
app.use(payFrequencyRouter);
app.use(bankAccountTypeRouter);
app.use(educationLevelRouter);
app.use(skillRouter);
app.use(languageRouter);
app.use(languageFluencyRouter);
app.use(languageCompetencyRouter);
app.use(licenseRouter);
app.use(membershipRouter);
app.use(pimConfigurationRouter);
app.use(eidConfigurationRouter);
app.use(nationalityRouter);
app.use(reportingMethodRouter);
app.use(localeRouter);
app.use(customFieldRouter);
app.use(employeeReportRouter);
app.use(workShiftRouter);
app.use(organizationRouter);
app.use(leavePeriodRouter);
app.use(leaveTypeRouter);
app.use(workWeekRouter);
app.use(holidayRouter);
// app.use(chatRouter);


// app.use(testRouter);

app.listen(port, () => {
    console.log('server is up: ', port);
})