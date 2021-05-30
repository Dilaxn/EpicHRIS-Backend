const moment = require('moment');
const {LeaveDay} = require('../LeaveDayComponent/leaveDayModel');
const {Leave} = require('../LeaveComponent/leaveModel');
const WorkWeekService = require('../WorkWeekComponent/WorkWeekService');
const LeaveEntitlementService = require('../LeaveEntitlementComponent/LeaveEntitlementService');
const HolidayService = require('../HolidayComponent/HolidayService');
const LeavePeriodService = require('../LeavePeriodComponent/LeavePeriodService');
const EmployeeService = require('../EmployeeComponent/EmployeeService');

class LeaveService {
    #workWeekService;
    #entitlementService;
    #holidayService;
    #leavePeriodService;
    #employeeService

    constructor(WorkWeekServiceClass = WorkWeekService, EntitlementClass = LeaveEntitlementService, HolidayServiceClass = HolidayService, LeavePeriodServiceClass = LeavePeriodService, EmployeeServiceClass = EmployeeService) {
        this.#workWeekService = new WorkWeekServiceClass();
        this.#entitlementService = new EntitlementClass();
        this.#holidayService = new HolidayServiceClass();
        this.#leavePeriodService = new LeavePeriodServiceClass();
        this.#employeeService = new EmployeeServiceClass();
    }

    async applyLeave(employee, leaveObj) {
        if (typeof leaveObj !== 'object' || leaveObj === null) {
            return {success: false, message: 'leave object in invalid'};
        }
        const keys = Object.keys(leaveObj);
        const allowedKeys = ['entitlement', 'startDate', 'startTime', 'endDate', 'endTime', 'comment'];
        const requiredKeys = ['entitlement', 'startDate', 'startTime', 'endDate', 'endTime'];
        const test1 = keys.every((key) => {
            return allowedKeys.includes(key);
        })
        const test2 = requiredKeys.every((requiredKey) => {
            return keys.includes(requiredKey);
        })
        if (!test1 || !test2) {
            return {success: false, message: 'invalid properties'};
        }
        const {entitlement, startDate, startTime, endDate, endTime} = leaveObj;
        const myEntitlement = await this.#entitlementService.getEntitlement(entitlement, employee);
        if (!myEntitlement) {
            return {
                success: false,
                message: 'entitlement not found'
            };
        }
        if (myEntitlement.entitlement <= myEntitlement.leaveTaken) {
            return {
                success: false,
                message: 'you have taken allocated leaves for this entitlement'
            };
        }
        const leavePeriod = await this.#leavePeriodService.findLeavePeriod(myEntitlement.leavePeriod);
        if (!leavePeriod) {
            return {
                success: false,
                message: 'leave Period not found'
            };
        }
        if (leavePeriod.status === 'past') {
            return {
                success: false,
                message: 'could not apply for past leave period'
            };
        }
        if (!moment(startDate, 'YYYY-MM-DD').isBetween(moment(leavePeriod.startDate), moment(leavePeriod.endDate))) {
            return {
                success: false,
                message: 'start date is not between entitlement leave period'
            };
        }
        if (!moment(endDate, 'YYYY-MM-DD').isBetween(moment(leavePeriod.startDate), moment(leavePeriod.endDate))) {
            return {
                success: false,
                message: 'end date is not between entitlement leave period'
            };
        }
        const splitDates = this.splitDateRange(startDate, startTime, endDate, endTime);
        if (splitDates.length === 0) {
            return {
                success: false,
                message: 'some thing wrong in split dates'
            };
        }
        const workDayConfiguration = await this.#workWeekService.getWorkDayConfiguration();
        if (!workDayConfiguration) {
            return {
                success: false,
                message: 'work day configuration not found'
            };
        }
        const leave = new Leave({
            entitlement: entitlement,
            startDay: moment(startDate, 'YYYY-MM-DD').toDate(),
            endDate: moment(endDate, 'YYYY-MM-DD').toDate(),
            startTime: moment.duration(startTime + ':00').asMilliseconds(),
            endTime: moment.duration(endTime + ':00').asMilliseconds(),
            comment: leaveObj.comment ? leaveObj.comment : null
        })
        const leaveDaysToSave = [];
        for (const splitDate of splitDates) {
            if (await this.isAllowedDayToApply(splitDate.date, employee)) {
                const holidays = await this.#holidayService.getHoliday(splitDate.date);
                const workDay = await this.#workWeekService.getWorkDayInfo(splitDate.date);
                const allowedDayTime = await this.getAllowedDayTime(holidays, workDay)
                const leaveDayTimeRanges = await this.generateLeaveDayTimeRange(splitDate, allowedDayTime, workDayConfiguration);
                if (leaveDayTimeRanges.length > 0) {
                    for (const leaveDayTimeRange of leaveDayTimeRanges) {
                        const leaveDay = new LeaveDay({
                            date: splitDate.date,
                            timeFrom: leaveDayTimeRange.from,
                            timeTo: leaveDayTimeRange.to,
                            status: 'pending-approval',
                            updatedBy: employee,
                            leave: leave._id,
                            entitlement,
                            employee
                        });
                        await leaveDay.validate();
                        leaveDaysToSave.push(leaveDay);
                    }

                }
            }

        }
        if (leaveDaysToSave.length === 0) {
            return {
                success: false,
                message: 'could not apply for leave something wrong'
            }
        }
        await leave.save();
        await LeaveDay.insertMany(leaveDaysToSave);
        await leave.populate({
            path: 'entitlement leaveDays',
            populate: {
                path: 'leaveType leavePeriod updatedBy employee',
                select: 'isEntitlementSituational leaveTypeName startDate endDate status first_name last_name employee_id'
            }
        }).execPopulate();
        return {
            success: true,
            data: leave
        };
    }

    async updateLeaveTaken() {
        const workDayConf = await this.#workWeekService.getWorkDayConfiguration();
        const halfM = workDayConf.halfMorning.to - workDayConf.halfMorning.from;
        const halfE = workDayConf.halfEvening.to - workDayConf.halfEvening.from;
        const totalTime = halfM + halfE;
        const now = moment().toDate();
        const leaveTaken = await LeaveDay.find({status: 'scheduled', date: {$lt: now}});
        console.log(now)
        for (const leaveDay of leaveTaken) {
            const day = (leaveDay.timeTo - leaveDay.timeFrom) / totalTime;
            await this.#entitlementService.increaseLeaveTaken(leaveDay.entitlement, day);
            leaveDay.status = 'taken';
            await leaveDay.save();
        }
    }

    static #buildQueryFilter(filter, queryOption) {
        if (queryOption.from) {
            filter.date = {
                $gte: moment(queryOption.from, 'YYYY-MM-DD').toDate()
            }
        }
        if (queryOption.to) {
            if (filter.date) {
                filter.date.$lte = moment(queryOption.to, 'YYYY-MM-DD').toDate();
            } else {
                filter.date = {
                    $lte: moment(queryOption.to, 'YYYY-MM-DD').toDate()
                }
            }
        }
        if (queryOption.status) {
            filter.status = queryOption.status;
        }
        return filter;
    }

    async findLeaves(filter) {
        const leaveDays = await LeaveDay.find(filter);
        if (!leaveDays) {
            return {
                success: false,
                message: 'leave days not found'
            }
        }
        const leaveIds = leaveDays.map((leaveDay) => leaveDay.leave.toString());
        const uniqueIds = [...new Set(leaveIds)];
        const leaves = await Leave.find({_id: {$in: uniqueIds}}).populate({
            path: 'entitlement leaveDays',
            populate: {
                path: 'leaveType leavePeriod updatedBy employee',
                select: 'isEntitlementSituational leaveTypeName startDate endDate status first_name last_name employee_id'
            }
        });
        if (leaves.length === 0) {
            return {
                success: false,
                message: 'leaves not found'
            }
        }
        return {
            success: true,
            data: leaves
        }
    }

    async queryMyLeaves(employee, queryOption) {
        const filter = {employee}
        return await this.findLeaves(LeaveService.#buildQueryFilter(filter, queryOption));
    }

    async querySubOrdinateLeave(employee, queryOption) {
        const subordinates = await this.#employeeService.findSubordinates(employee);
        if (subordinates.length === 0) {
            return {
                success: false,
                message: 'you do not have any subordinate'
            }
        }
        const filter = {
            employee: {$in: subordinates}
        }
        if (queryOption.employee) {
            if (subordinates.includes(queryOption.employee)) {
                filter.employee = queryOption.employee;
            } else {
                return {
                    success: false,
                    message: 'you are not allowed to see this employee leaves'
                }
            }
        }
        return await this.findLeaves(LeaveService.#buildQueryFilter(filter, queryOption));
    }

    async queryAllLeaveDays(queryObject) {
        const filter = {}
        if (queryObject.employee) {
            filter.employee = queryObject.employee;
        }
        return await this.findLeaves(LeaveService.#buildQueryFilter(filter, queryObject));
    }

    async updateLeaveDay(me, employee, update) {
        if (!update.hasOwnProperty('leaveDay') || !update.hasOwnProperty('action')) {
            return {success: false, message: 'invalid req.body found'};
        }
        const {leaveDay, action} = update;
        if (Array.isArray(leaveDay) && leaveDay.length > 0) {
            const updated = [];
            const leaveDays = await LeaveDay.find({employee, _id: {$in: leaveDay}});
            for (const day of leaveDays) {
                if (action === 'schedule') {
                    if (day.status === 'pending-approval') {
                        day.status = 'scheduled';
                        day.updatedBy = me;
                        await day.save();
                        updated.push(day);
                    }
                } else if (action === 'reject') {
                    if (day.status === 'pending-approval') {
                        day.status = 'rejected';
                        day.updatedBy = me;
                        await day.save();
                        updated.push(day);
                    }
                } else if (action === 'cancel') {
                    if (day.status === 'pending-approval' || day.status === 'scheduled') {
                        day.status = 'cancelled';
                        day.updatedBy = me;
                        await day.save();
                        updated.push(day);
                    }
                }
            }
            if (updated.length === 0) {
                return {success: false, message: 'could not update anything. oops!'};
            }
            return {success: true, data: updated}
        }
        if (typeof leaveDay === 'string') {
            const day = await LeaveDay.findOne({employee, _id: leaveDay});
            if (!day) {
                return {success: false, message: 'could not found'};
            }
            if (action === 'schedule') {
                if (day.status === 'pending-approval') {
                    day.status = 'scheduled';
                    day.updatedBy = me;
                    await day.save();
                    return {success: true, data: day};
                }
            } else if (action === 'reject') {
                if (day.status === 'pending-approval') {
                    day.status = 'rejected';
                    day.updatedBy = me;
                    await day.save();
                    return {success: true, data: day};
                }
            } else if (action === 'cancel') {
                if (day.status === 'pending-approval' || day.status === 'scheduled') {
                    day.status = 'cancelled';
                    day.updatedBy = me;
                    await day.save();
                    return {success: true, data: day};
                }
            }
        }
        return {success: false, message: 'unable to update'};
    }

    async cancelMyLeaveRequest(employee, option) {
        if (!option.hasOwnProperty('leaveDay')) {
            return {success: false, message: 'leave day property not found'};
        }
        const {leaveDay} = option;
        if (Array.isArray(leaveDay) && leaveDay.length > 0) {
            const updated = [];
            const leaveDays = await LeaveDay.find({employee, _id: {$in: leaveDay}});
            for (const day of leaveDays) {
                if (day.status === 'pending-approval' || day.status === 'scheduled') {
                    day.status = 'cancelled';
                    day.updatedBy = employee;
                    await day.save();
                    updated.push(day);
                }
            }
            if (updated.length === 0) {
                return {success: false, message: 'could not cancel anything'};
            }
            return {success: true, data: updated}
        }
        if (typeof leaveDay === 'string') {
            const day = await LeaveDay.findOne({employee, _id: leaveDay});
            if (!day) {
                return {success: false, message: 'could not found'};
            }
            if (day.status === 'pending-approval' || day.status === 'scheduled') {
                day.status = 'cancelled';
                day.updatedBy = employee;
                await day.save();
                return {success: true, data: day};
            }
        }
        return {success: false, message: 'unable to update'};
    }

    splitDateRange(startDate, startTime, endDate, endTime) {
        const timeFrom = this.isValidTime(startTime);
        const timeTo = this.isValidTime(endTime);
        if (!timeFrom || !timeTo) {
            return [];
        }
        const startMoment = moment(startDate, 'YYYY-MM-DD');
        const endMoment = moment(endDate, 'YYYY-MM-DD');
        if (!startMoment.isValid() || !endMoment.isValid()) {
            return [];
        }
        const startDuration = moment.duration(timeFrom + ':00');
        const endDuration = moment.duration(timeTo + ':00');
        startMoment.startOf('day').add(startDuration.asMilliseconds(), 'milliseconds');
        endMoment.startOf('day').add(endDuration.asMilliseconds(), 'milliseconds');
        if (startMoment.isSameOrAfter(endMoment)) {
            return [];
        }
        const tempStart = startMoment.clone().startOf('day');
        const tempEnd = endMoment.clone().startOf('day');
        const splitDates = [];
        if (tempStart.isSame(tempEnd)) {
            splitDates.push({
                date: tempStart.toDate(),
                startTime: startDuration.asMilliseconds(),
                endTime: endDuration.asMilliseconds()
            })
            return splitDates;
        }
        splitDates.push({
            date: tempStart.toDate(),
            startTime: startDuration.asMilliseconds(),
            endTime: moment.duration(1, 'day').subtract(1, 'millisecond').asMilliseconds()
        })
        tempStart.add(1, 'day');
        while (tempStart.isBefore(tempEnd)) {
            splitDates.push({
                date: tempStart.toDate(),
                startTime: 0,
                endTime: moment.duration(1, 'day').subtract(1, 'millisecond').asMilliseconds()
            })
            tempStart.add(1, 'day');
        }
        splitDates.push({
            date: tempEnd.toDate(),
            startTime: 0,
            endTime: endDuration.asMilliseconds()
        })
        return splitDates;
    }

    isValidTime(time) {
        if (typeof time !== 'string') {
            return null;
        }
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/mg;
        const matchedTime = time.match(timeRegex);
        if (!matchedTime) {
            return null;
        }
        return matchedTime[0];
    }

    async getAllowedDayTime(holidays, workday) {
        if (workday.dayType === 'non') {
            return 'non';
        }
        const holidayTypes = [];
        holidays.forEach((holiday) => {
            holidayTypes.push(holiday.holidayType);
        })
        if (workday.dayType === 'half-M') {
            if (holidayTypes.includes('full')) {
                return 'non';
            }
            if (holidayTypes.includes('half-M')) {
                return 'non';
            }
            return 'half-M'
        }
        if (workday.dayType === 'half-E') {
            if (holidayTypes.includes('full')) {
                return 'non';
            }
            if (holidayTypes.includes('half-E')) {
                return 'non';
            }
            return 'half-E';
        }
        if (workday.dayType === 'full') {
            if (holidayTypes.includes('full')) {
                return 'non';
            }
            if (holidayTypes.includes('half-M') && holidayTypes.includes('half-E')) {
                return 'non';
            }
            if (holidayTypes.includes('half-M')) {
                return 'half-E';
            }
            if (holidayTypes.includes('half-E')) {
                return 'half-M';
            }
            return 'full';
        }

    }

    async generateLeaveDayTimeRange(daySplit, allowedDaytime, weekDayConfig) {
        const allowedDayTimeRange = [];
        if (allowedDaytime === 'half-M') {
            allowedDayTimeRange.push({
                from: weekDayConfig.halfMorning.from,
                to: weekDayConfig.halfMorning.to
            })
        }
        if (allowedDaytime === 'half-E') {
            allowedDayTimeRange.push({
                from: weekDayConfig.halfEvening.from,
                to: weekDayConfig.halfEvening.to
            })
        }
        if (allowedDaytime === 'full') {
            allowedDayTimeRange.push({
                from: weekDayConfig.halfMorning.from,
                to: weekDayConfig.halfMorning.to
            })
            allowedDayTimeRange.push({
                from: weekDayConfig.halfEvening.from,
                to: weekDayConfig.halfEvening.to
            })
        }
        if (allowedDayTimeRange.length === 0) {
            return [];
        }
        const res = [];
        allowedDayTimeRange.forEach((allowedDayTime) => {
            if (allowedDayTime.from <= daySplit.startTime && allowedDayTime.to > daySplit.startTime && allowedDayTime.to <= daySplit.endTime) {
                res.push({
                    from: daySplit.startTime,
                    to: allowedDayTime.to
                })
            } else if (allowedDayTime.from >= daySplit.startTime && allowedDayTime.from < daySplit.endTime && allowedDayTime.to > daySplit.startTime && allowedDayTime.to <= daySplit.endTime) {
                res.push({
                    from: allowedDayTime.from,
                    to: allowedDayTime.to
                })
            } else if (allowedDayTime.from < daySplit.endTime && allowedDayTime.from >= daySplit.startTime && allowedDayTime.to >= daySplit.endTime) {
                res.push({
                    from: allowedDayTime.from,
                    to: daySplit.endTime
                })
            } else if (allowedDayTime.from <= daySplit.startTime && allowedDayTime.to >= daySplit.endTime) {
                res.push({
                    from: daySplit.startTime,
                    to: daySplit.endTime
                })
            }

        })
        return res;
    }

    async isAllowedDayToApply(date, employee) {
        const dateMoment = moment(date, 'YYYY-MM-DD');
        if (!dateMoment.isValid()) {
            return false;
        }
        const filter = {
            employee: employee,
            date: {
                $gte: dateMoment.startOf('day').toDate(),
                $lte: dateMoment.endOf('day').toDate()
            },
            status: {$nin: ['cancelled', 'rejected']}
        }
        const leaveDays = await LeaveDay.find(filter);
        return leaveDays.length === 0;
    }
}

module.exports = LeaveService;