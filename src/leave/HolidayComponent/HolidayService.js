const moment = require('moment');
const {Holiday} = require('./holidayModel');
class HolidayService {
    async addAHoliday(holidayToAdd) {
        const holiday = new Holiday({
            ...holidayToAdd
        });
        await holiday.save();
        return holiday;
    }
    async getHoliday(date) {
        const dateMoment = moment(date, 'YYYY-MM-DD');
        if (!dateMoment.isValid()) {
            return [];
        }
        const $gte = dateMoment.clone().startOf('day').toDate();
        const $lte = dateMoment.clone().endOf('day').toDate();
        const holiday = await Holiday.find({holidayDate: {$gte, $lte}});
        if (holiday.length === 0) {
            return [];
        }
        return holiday;
    }

    async queryHoliday(options) {
        let filter = {};
        if (options.from) {
            filter.holidayDate = {$gte: options.from}
        }
        if (options.to) {
            if (typeof filter.holidayDate === 'object') {
                filter.holidayDate.$lte = options.to
            }else {
                filter.holidayDate = {$lte: options.to}
            }
        }
        const holidays = await Holiday.find(filter);
        if (holidays.length === 0) {
            throw new Error('holiday not found');
        }
        return holidays;
    }
    async updateAHoliday(id, update) {
        const keys = Object.keys(update);
        const allowedKeys = ['holidayName', 'holidayDate', 'isRepeatedAnnually', 'holidayType'];
        const isValidOps = keys.every((key) => {
            return allowedKeys.includes(key);
        });
        if (!isValidOps) {
            throw new Error('invalid properties sent');
        }
        const holiday = await Holiday.findById(id);
        if (!holiday) {
            throw new Error('holiday not found');
        }
        keys.forEach((key) => {
            holiday[key] = update[key];
        });
        await holiday.save();
        return holiday;
    }
    async deleteHolidays(holidayIdObj) {
        if (!holidayIdObj.id) {
            throw new Error('id property not found');
        }
        if (Array.isArray(holidayIdObj.id) && holidayIdObj.id.length >= 1) {
            const deleted = await Holiday.deleteMany({_id: {$in: holidayIdObj.id}});
            if (deleted.deletedCount > 0) {
                return {deletedCount: deleted.deletedCount};
            }
            throw new Error('could not delete');
        }
        const deleted = await Holiday.findByIdAndDelete(holidayIdObj.id);
        if (!deleted) {
            throw new Error('could not delete');
        }
        return deleted;
    }
}
module.exports = HolidayService;