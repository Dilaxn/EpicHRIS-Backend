const LeavePeriodConfigurationService = require('../src/leave/LeavePeriodConfigurationComponent/LeavePeriodConfigurationService');
const LeavePeriodService = require('../src/leave/LeavePeriodComponent/LeavePeriodService');
const LeaveTypeService = require('../src/leave/LeaveTypeComponent/LeaveTypeService');
const WorkWeekService = require('../src/leave/WorkWeekComponent/WorkWeekService');
const leavePeriodConfigurationService = new LeavePeriodConfigurationService();
const leavePeriodService = new LeavePeriodService();
const leaveTypeService = new LeaveTypeService();
const workWeekService = new WorkWeekService();
const loadLeaveStartUpModules = async () => {
    const leavePeriodConfiguration = await leavePeriodConfigurationService.initializeLeavePeriodConfiguration();
    if (leavePeriodConfiguration) {
        console.log('leave period configuration added');
    } else {
        console.log('leave period configuration already exist');
    }
    const leavePeriods = await leavePeriodService.initializeLeavePeriod();
    if (leavePeriods) {
        console.log('leave period was initialized');
    } else {
        console.log('leave period already exist');
    }
    const deleteLeaveType = await leaveTypeService.queryLeaveTypes({leaveTypeName: 'deleted'});
    if (!deleteLeaveType) {
        await leaveTypeService.addALeaveType({
            leaveTypeName: 'deleted',
        })
        console.log('default deleted leave type added');
    }else {
        console.log('default deleted leave type exist');
    }
    const workDayConf = await workWeekService.initializeWorkDayConfiguration();
    if (workDayConf) {
        console.log('work day configuration added');
    }else {
        console.log('work day configuration already exist');
    }

}
module.exports = {loadLeaveStartUpModules}