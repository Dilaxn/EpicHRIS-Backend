const TimeSheetWeekService = require('../src/time/TimeSheetWeekComponent/TimeSheetWeekService');
const timeSheetWeekService = new TimeSheetWeekService();
const loadTimeStartupModules = async () => {
    const addedWeek = await timeSheetWeekService.initializeTimeSheetWeek();
    if (addedWeek) {
        console.log('timeSheet weeks initialized');
    }
    console.log('time sheet week exist');
};
module.exports = {loadTimeStartupModules};
