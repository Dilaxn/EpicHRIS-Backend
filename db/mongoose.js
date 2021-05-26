const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('mongoDB connected successfully');
}).catch((e) => {
    console.log({message: 'something wrong connecting database server', error: e});
});

// mongoose.connect('mongodb://127.0.0.1:27017/hrm-backend', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
// }).then(() => {
//     console.log('mongoDB connected successfully');
// }).catch(() => {
//     console.log('something wrong connecting database server');
// });

const {createAdmin} = require('../installer/admin');
const {loadCountriesToDatabase} = require('../installer/country');
const {loadJobCategoriesToDB} = require('../installer/job_category');
const {loadOrganizationUnitToDB} = require('../installer/organizationUnit');
const {loadTerminationReasonToDB} = require('../installer/termination_reason');
const {loadCurrencyData} = require('../installer/currency');
const {loadPayFrequenciesToDatabase} = require('../installer/pay_frequency');
const {loadLanguagesToDatabase} = require('../installer/language');
const {insertLanguageFluencyIntoDatabase} = require('../installer/language_fluency');
const {insertLanguageCompetencies} = require('../installer/language_competency');
const {insertDefaultPimConfiguration} = require('../installer/pim_configuration');
const {insertDefaultEidConf} = require('../installer/eid_configuration');
const {insertNationalities} = require('../installer/nationality');
const {insertReportingMethods} = require('../installer/reporting_method');
const {insertLocales} = require('../installer/locale');
const {insertAllMimeTypes} = require('../installer/mime');
const {loadLeaveStartUpModules} = require('../installer/leaveModuleLoader');
// const {setupWorkWeekDefaultConf} = require('../installer/work_week');



const setUpDatabase = async () => {
    try {
        await createAdmin();
        await loadCountriesToDatabase();
        await loadJobCategoriesToDB();
        await loadOrganizationUnitToDB();
        await loadTerminationReasonToDB();
        await loadCurrencyData().then();
        await loadPayFrequenciesToDatabase();
        await loadLanguagesToDatabase();
        await insertLanguageFluencyIntoDatabase();
        await insertLanguageCompetencies();
        await insertDefaultPimConfiguration();
        await insertDefaultEidConf();
        await insertNationalities();
        await insertReportingMethods();
        await insertLocales();
        await insertAllMimeTypes();
        await loadLeaveStartUpModules();
        // await setupWorkWeekDefaultConf();
        console.log('database ready to use');
    }catch (e) {
        console.log(e);
    }
}

setUpDatabase().then(() => {
    console.log('success');
}).catch(() => {
    console.log('failed');
});




