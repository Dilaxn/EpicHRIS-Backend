const {TimeSheet} = require('./timeSheetModel');
const TimeSheetWeekService = require('../TimeSheetWeekComponent/TimeSheetWeekService');
const TimeSheetTaskService = require('../TimeSheetTaskComponent/TimeSheetTaskService');
const TimeSheetActionService = require('../TimeSheetActionComponent/TimeSheetActionService');
const EmployeeService = require('../../leave/EmployeeComponent/EmployeeService');
class TimeSheetService {
    #timeSheetWeekService;
    #timeSheetTaskService;
    #timeSheetActionService;
    #employeeService;

    constructor(TimeSheetWeekClass = TimeSheetWeekService,
                TimeSheetTaskClass = TimeSheetTaskService,
                TimeSheetActionServiceClass = TimeSheetActionService,
                EmployeeServiceClass = EmployeeService) {
        this.#timeSheetWeekService = new TimeSheetWeekClass();
        this.#timeSheetTaskService = new TimeSheetTaskClass();
        this.#timeSheetActionService = new TimeSheetActionServiceClass();
        this.#employeeService = new EmployeeServiceClass();
    }

    async createATimeSheet(employeeId, timeSheetWeekId) {
        const newTimeSheet = new TimeSheet({
            employee: employeeId,
            timeSheetWeek: timeSheetWeekId
        });
        await newTimeSheet.save();
        await newTimeSheet.populate({
            path: 'employee timeSheetWeek tasks actions.performedBy',
            select: 'first_name last_name employee_id startDate endDate allocatedHours',
            populate: {
                path: 'projectName activity',
                select: 'projectName activityName'
            }
        }).execPopulate();
        return newTimeSheet;

    }

    async findTimeSheet(employeeId, timeSheetWeekId) {
        if (!employeeId || !timeSheetWeekId) {
            return null;
        }
        const timeSheet = await TimeSheet.findOne({employee: employeeId, timeSheetWeek: timeSheetWeekId}).populate({
            path: 'employee timeSheetWeek tasks actions.performedBy',
            select: 'first_name last_name employee_id startDate endDate allocatedHours',
            populate: {
                path: 'projectName activity',
                select: 'projectName activityName'
            }
        });
        if (!timeSheet) {
            return null;
        }
        return timeSheet;
    }

    async readAnEmployeeTimeSheet(employeeId, timeSheetWeek) {
        const gotTimeSheetWeek = await this.#timeSheetWeekService.getTimeSheetWeekById(timeSheetWeek);
        if (gotTimeSheetWeek) {
            const timeSheet = await this.findTimeSheet(employeeId, gotTimeSheetWeek._id);
            if (timeSheet) {
                return {success: true, data: timeSheet};
            }
            const created = await this.createATimeSheet(employeeId, gotTimeSheetWeek._id);
            if (created) {
                return {success: true, data: created};
            }
            return {success: false, message: 'could not create a time sheet'};
        }
        const timeSheetWeekGotByDate = await this.#timeSheetWeekService.getTimeSheetWeekFromDate(timeSheetWeek);
        if (!timeSheetWeekGotByDate) {
            return {success: false, message: 'timeSheet Week not found'};
        }
        const timeSheetFound = await this.findTimeSheet(employeeId, timeSheetWeekGotByDate._id);
        if (!timeSheetFound) {
            const newTimeSheet = await this.createATimeSheet(employeeId, timeSheetWeekGotByDate._id);
            if (newTimeSheet) {
                return {success: true, data: newTimeSheet};
            }
            return {success: false, message: 'could not create a time sheet'};
        }
        return {success: true, data: timeSheetFound};
    }

    async getTimeSheet(employeeId, timeSheetId, status) {
        const filter = {
            employee: employeeId,
            _id: timeSheetId,
            status: status
        }
        const timeSheet = await TimeSheet.findOne(filter);
        if (!timeSheet) {
            return null;
        }
        return timeSheet;
    }

    async updateEmployeeTimeSheet(employeeId, timeSheetId, taskObj, status, myId) {
        const timeSheet = await this.getTimeSheet(employeeId, timeSheetId, status);
        if (!timeSheet) {
            return {success: false, message: 'timeSheet not found'};
        }
        if (!taskObj.hasOwnProperty('tasks') || taskObj.tasks.length === 0) {
            return {success: false, message: 'tasks property not found in body'};
        }
        const tasks = taskObj.tasks;
        const updatedTasks = await this.#timeSheetTaskService.saveTasks(tasks, timeSheetId);

        if (updatedTasks.length === 0) {
            return {success: false, message: 'no record updated'};
        }
        const action = await this.#timeSheetActionService.createAnAction('updated', myId, null);
        timeSheet.actions.push(action);
        await timeSheet.save();
        //send email to supervisor
        await timeSheet.populate({
            path: 'employee timeSheetWeek tasks actions.performedBy',
            select: 'first_name last_name employee_id startDate endDate allocatedHours',
            populate: {
                path: 'projectName activity',
                select: 'projectName activityName'
            }
        }).execPopulate();
        return {success: true, data: timeSheet};
    }

    async submitEmployeeTimeSheet(employeeId, timeSheetId, taskObj, myId) {
        const timeSheet = await this.getTimeSheet(employeeId, timeSheetId, 'not-submitted');
        if (!timeSheet) {
            return {success: false, message: 'time sheet not found'};
        }
        if (!taskObj.hasOwnProperty('tasks') || taskObj.tasks.length === 0) {
            return {success: false, message: 'tasks property not found'};
        }
        const timeSheetTasks = taskObj.tasks;
        const updatedTasks = await this.#timeSheetTaskService.saveTasks(timeSheetTasks, timeSheetId);
        if (updatedTasks.length === 0) {
            return {success: false, message: 'could not be updated'};
        }
        const comment = taskObj.hasOwnProperty('comment') ? taskObj.comment.toString() : null;
        const action = await this.#timeSheetActionService.createAnAction('submitted', myId, comment);
        timeSheet.actions.push(action);
        timeSheet.status = 'submitted'
        await timeSheet.save();
        //send email to supervisor
        await timeSheet.populate({
            path: 'employee timeSheetWeek tasks actions.performedBy',
            select: 'first_name last_name employee_id startDate endDate allocatedHours',
            populate: {
                path: 'projectName activity',
                select: 'projectName activityName'
            }
        }).execPopulate();
        return {success: true, data: timeSheet};
    }
    async queryBuilder(baseFilter, timeSheetWeekId, status) {
        if (timeSheetWeekId) {
            baseFilter.timeSheetWeek = timeSheetWeekId;
        }
        if (status) {
            baseFilter.status = status
        }
        return baseFilter;
    }
    async queryEmployeeTimeSheets(filter) {
        const timeSheets = await TimeSheet.find(filter).populate({
            path: 'employee timeSheetWeek tasks actions.performedBy',
            select: 'first_name last_name employee_id startDate endDate allocatedHours',
            populate: {
                path: 'projectName activity',
                select: 'projectName activityName'
            }
        });
        if (timeSheets.length === 0) {
            return {success: false, message: 'not found time sheets'};
        }
        return {success: true, data: timeSheets};
    }
    async queryMyTimeSheets(timeSheetWeekId, status, myId) {
        const baseFilter = {employee: myId};
        const finalFilter = await this.queryBuilder(baseFilter, timeSheetWeekId, status);
        return this.queryEmployeeTimeSheets(finalFilter);
    }
    async queryAllTimeSheets(employeeId, timeSheetWeekId, status) {
        const baseFilter = {};
        if (employeeId) {
            baseFilter.employee = employeeId;
        }
        const finalFilter = await this.queryBuilder(baseFilter, timeSheetWeekId, status);
        return await this.queryEmployeeTimeSheets(finalFilter);
    }

    async queryMySubordinatesTimeSheets(employeeId, timeSheetWeekId, status, myId) {
        const subordinatesId = await this.#employeeService.findSubordinates(myId);
        if (subordinatesId.length === 0) {
            return {success: false, message: 'you do not have any sub ordinates'};
        }
        const filter = {
            employee: {$in: subordinatesId}
        }
        if (employeeId) {
            if (subordinatesId.includes(employeeId)) {
                filter.employee = employeeId;
            }
        }
        const finalFilter = await this.queryBuilder(filter, timeSheetWeekId, status);
        return await this.queryEmployeeTimeSheets(finalFilter);
    }
    async submitOrApproveOrResetOrReject(timeSheetId, employeeId, myId, comment, action) {
        let preStatus;
        let postStatus;
        if (action === 'submitted') {
            preStatus = 'not-submitted';
            postStatus = 'submitted';
        }else if (action === 'approved') {
            preStatus = 'submitted';
            postStatus = 'approved';
        }else if (action === 'reset') {
            preStatus = 'approved';
            postStatus = 'submitted';
        }else if (action === 'rejected') {
            preStatus = 'submitted';
            postStatus = 'not-submitted'
        }else {
            return {success: false, message: 'invalid action'}
        }
        console.log(preStatus, postStatus)
        const timeSheet = await this.getTimeSheet(employeeId, timeSheetId, preStatus);
        if (!timeSheet) {
            return {success: false, message: 'time sheet not found'};
        }
        const addedAction = await this.#timeSheetActionService.createAnAction(action, myId, comment);
        await addedAction.validate();
        timeSheet.actions.push(addedAction);
        timeSheet.status = postStatus;
        await timeSheet.save();
        await timeSheet.populate({
            path: 'employee timeSheetWeek tasks actions.performedBy',
            select: 'first_name last_name employee_id startDate endDate allocatedHours',
            populate: {
                path: 'projectName activity',
                select: 'projectName activityName'
            }
        }).execPopulate();
        return {success: true, data: timeSheet};
    }
}

module.exports = TimeSheetService;
