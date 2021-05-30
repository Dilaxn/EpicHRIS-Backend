const moment = require('moment');
const {Attendance} = require('./attendanceModel');
const WorkWeekService = require('../../leave/WorkWeekComponent/WorkWeekService');

class AttendanceService {
    #workWeekService;

    constructor(WorkWeekServiceClass = WorkWeekService) {
        this.#workWeekService = new WorkWeekServiceClass();
    }
    async queryAttendance(queryOption) {
        const filter = {};
        if (queryOption.hasOwnProperty('employee')) {
            filter.employee = queryOption.employee;
        }
        if (queryOption.hasOwnProperty('from')) {
            const startMoment = moment(queryOption.from, 'YYYY-MM-DD');
            if (startMoment.isValid()) {
                filter.punchInTime = {$gte: startMoment.startOf('day').toDate()}
            }
        }
        if (queryOption.hasOwnProperty('to')) {
            const endMoment = moment(queryOption.to, 'YYYY-MM-DD');
            if (endMoment.isValid()) {
                if(filter.hasOwnProperty('punchInTime')) {
                    filter.punchInTime.$lte = endMoment.endOf('day').toDate();
                }else {
                    filter.punchInTime = {$lte: endMoment.startOf('day').toDate()}
                }
            }
        }
        const attendance = await Attendance.find(filter).populate({
            path: 'employee updatedBy',
            select: 'first_name last_name employee_id'
        });
        if (attendance.length === 0) {
            return {success: false, message: 'not found attendants'};
        }
        return {success: true, data: attendance};
    }
    async updateAttendance(employee, id, update, updatedBy) {
        const attendance = await Attendance.findOne({employee, _id: id});
        if (!attendance) {
            return {success: false, message: 'not found attendance'};
        }
        let allowedKeys;
        if (attendance.status === 'punched-out') {
            allowedKeys = ['punchInTime', 'punchInNote', 'punchOutTime', 'punchOutNote']
        } else {
            allowedKeys = ['punchInTime', 'punchInNote'];
        }
        const keys = Object.keys(update);
        const validation = keys.every((key) => {
            return allowedKeys.includes(key);
        });
        if (!validation) {
            return {success: false, message: 'invalid Keys added to the req.body'};
        }
        if (update.hasOwnProperty('punchInTime')) {
            const punchIn = moment(update.punchInTime);
            if (!punchIn.isValid()) {
                return {success: false, message: 'punch in time validation failed'};
            }
            attendance.punchInTime = punchIn.toDate();
        }
        if (update.hasOwnProperty('punchInNote')) {
            attendance.punchInNote = update.punchInNote;
        }
        if (update.hasOwnProperty('punchOutTime')) {
            const punchOut = moment(update.punchOutTime);
            if (!punchOut.isValid()) {
                return {success: false, message: 'punch out time validation failed'};
            }
            attendance.punchOutTime = punchOut.toDate();
        }
        if (update.hasOwnProperty('punchOutNote')) {
            attendance.punchOutNote = update.punchOutNote;
        }
        attendance.updatedBy = updatedBy
        await attendance.save();
        await attendance.populate({
            path: 'employee updatedBy',
            select: 'first_name last_name employee_id'
        }).execPopulate();
        return {
            success: true,
            data: attendance
        }
    }

    async addAnAttendance(employee, data, updatedBy) {
        const allowedKeys = ['punchInTime', 'punchInNote', 'punchOutTime', 'punchOutNote'];
        const keys = Object.keys(data);
        const validation1 = keys.every((key) => {
            return allowedKeys.includes(key);
        });
        if (!validation1) {
            return {success: false, message: 'invalid Keys added to the req.body'};
        }
        const requiredKeys = ['punchInTime', 'punchOutTime'];
        const validation2 = requiredKeys.every((requiredKey) => {
            return keys.includes(requiredKey);
        })
        if (!validation2) {
            return {success: false, message: 'required property missing in req.body'};
        }
        const maxTime = await this.#workWeekService.getTotalWorkingDayTime();
        const punchIn = moment(data.punchInTime);
        const punchOut = moment(data.punchOutTime);
        if (!punchIn.isValid() || !punchOut.isValid()) {
            return {success: false, message: 'punch in or punch out time string invalid'};
        }
        const diff = punchOut.valueOf() - punchIn.valueOf();
        if (diff > maxTime) {
            return {success: false, message: 'time duration exceeds allocated time'};
        }
        const newAttendance = new Attendance({
            employee,
            punchInTime: punchIn.toDate(),
            punchInNote: data.punchInNote ? data.punchInNote : null,
            punchOutTime: punchOut.toDate(),
            punchOutNote: data.punchOutNote ? data.punchInNote : null,
            status: 'punched-out',
            updatedBy
        });
        await newAttendance.save();
        await newAttendance.populate({
            path: 'employee updatedBy',
            select: 'first_name last_name employee_id'
        }).execPopulate();
        return {
            success: true,
            data: newAttendance
        }
    }

    async punchIn(employee, note) {
        if (await this.isPunchedIn(employee)) {
            return {
                success: false,
                message: 'you already punched in, punched out first'
            }
        }
        const attendance = new Attendance({
            employee: employee,
            punchInTime: moment().toDate(),
            punchInNote: note ? note : null,
            status: 'punched-in',
            updatedBy: employee
        })
        await attendance.save();
        await attendance.populate({
            path: 'employee updatedBy',
            select: 'first_name last_name employee_id'
        }).execPopulate();
        return {
            success: true,
            data: attendance
        }
    }

    async punchOut(employee, note) {
        const punchedIn = await this.isPunchedIn(employee);
        if (!punchedIn) {
            return {
                success: false,
                message: 'you have not punched in yet'
            }
        }
        punchedIn.punchOutTime = moment().toDate();
        punchedIn.punchOutNote = note;
        punchedIn.status = 'punched-out';
        punchedIn.updatedBy = employee;
        await punchedIn.save();
        await punchedIn.populate({
            path: 'employee updatedBy',
            select: 'first_name last_name employee_id'
        }).execPopulate();
        return {
            success: true,
            data: punchedIn
        }

    }

    async isPunchedIn(employee) {
        const filter = {
            employee,
            status: 'punched-in',
        }
        const attendance = await Attendance.findOne(filter);
        if (!attendance) {
            return null;
        }
        return attendance;
    }
}

module.exports = AttendanceService;
