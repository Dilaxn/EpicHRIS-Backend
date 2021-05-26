const express = require('express');
require('dotenv').config();
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

const vacancyRouter = require('./src/admin/routers/vacancies');
const applicantRouter = require('./src/admin/routers/applicants');
//leave

const leavePeriodConfigurationRouter = require('./src/leave/LeavePeriodConfigurationComponent/leavePeriodConfigurationRoute')
const leaveTypeRouter = require('./src/leave/LeaveTypeComponent/leaveTypeRoute');
const workWeekRouter = require('./src/leave/WorkWeekComponent/workWeekRoute');
const holidayRouter = require('./src/leave/HolidayComponent/holidayRoute');
const leavePeriodRouter = require('./src/leave/LeavePeriodComponent/leavePeriodRoute');
const leaveEntitlementRouter = require('./src/leave/LeaveEntitlementComponent/leaveEntitlementRoute');

// const chatRouter = require('./src/admin/routers/chat');
const productRoutes = require("./src/image/controllers/ProfilePic");

// const testRouter = require('./playground/test');


const app = express();
const port = process.env.PORT || 3001;
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
app.use(express.urlencoded({
    extended: true
}))

app.set('view engine', 'ejs');
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.status(400).send({ status: 404, message: err.message }); // Bad request
    }
    next();
});

var request = require("request");

// request.get(
//     {
//         url : "http://localhost:3001/vacancies"
//     },
//     function (error, response, body) {
//         // Do more stuff with 'body' here
//         if (!error && response.statusCode == 200) {
//             var json_body = JSON.parse(body);
//             console.log(json_body);
//             // var msg = json_body.profile.user;//this is the message i want to show on my web page(msg)
//             // console.log(msg); // get json response
//         }
//     }
// );

app.get('/vacanciesPosts', function(req, res) {
    let y=[];
    request.get(
        {
            url : "http://localhost:3001/vacancies"
        },
        function (error, response, body) {
            // Do more stuff with 'body' here

            if (!error && response.statusCode == 200) {

                var json_body = JSON.parse(body);


                res.render( "pages/Vacancies", {name:json_body});
            }
        }
    );

});

app.post('/vacancyApply', function(req, res) {
    console.log("x"+req.body.mName)
    res.render( "pages/VacancyApply",{mn:req.body.mName,mi:req.body.mId});

});

// app.post("http://localhost:3001/applicants",(req,res)=>{
//     console.log(req.body)
//     // var name = req.body.name;
//     // var email = req.body.email;
//     // var theme = req.body.theme;
//     // var guest = req.body.theme;
//     // obj.create({name:name, email:email, theme:theme, guest:guest});
//     res.redirect("http://localhost:3001/vacanciesPosts");
// })

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
app.use(vacancyRouter);
app.use(applicantRouter);
//leave

app.use(leavePeriodConfigurationRouter);
app.use(leaveTypeRouter);
app.use(workWeekRouter);
app.use(holidayRouter);
app.use(leavePeriodRouter)
app.use(leaveEntitlementRouter)

// app.use(chatRouter);


// app.use(testRouter);

app.listen(port, () => {
    console.log('server is up: ', port);
})