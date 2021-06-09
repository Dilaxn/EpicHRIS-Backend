const moment = require('moment');
const {TimeSheetWeek} = require('./timeSheetWeekModel');
class TimeSheetWeekService {
    async initializeTimeSheetWeek() {
        const timeSheets = await TimeSheetWeek.find({});
        if (timeSheets.length === 0) {
            const lastMonday = moment().day(1 - 7).startOf('day');
            const lastSunday = lastMonday.clone().add(6, 'days');
            const thisMonday = lastSunday.clone().add(1, 'day');
            const thisSunday = thisMonday.clone().add(6, 'days');
            const lastWeek = new TimeSheetWeek({
                startDate: lastMonday,
                endDate: lastSunday
            });
            const thisWeek = new TimeSheetWeek({
                startDate: thisMonday,
                endDate: thisSunday
            })
            await lastWeek.save();
            await thisWeek.save();
            return {lastWeek, thisWeek};
        }
        return null;
    }
    async getTimeSheet(queryOption) {
        const filter = {};
        if (queryOption.startDate) {
            filter.startDate = {$gte: moment(queryOption.startDate).toDate()}
        }
        if (queryOption.endDate) {
            filter.endDate = {$lte: moment(queryOption.endDate).toDate()}
        }
        const weeks = await TimeSheetWeek.find(filter).sort('-endDate');
        if (weeks.length === 0) {
            return {success: true, data: []};
        }
        return {success: true, data: weeks};
    }
    async getTimeSheetWeekFromDate(date) {
        const dateMoment =  moment(date).startOf('day');
        if (!dateMoment.isValid()) {
            return null;
        }
        const filter = {
            startDate: {$lte: dateMoment.toDate()},
            endDate: {$gte: dateMoment.toDate()}
        }
        const timeSheetWeek = await TimeSheetWeek.findOne(filter);
        if (!timeSheetWeek) {
            return null;
        }
        return timeSheetWeek;
    }
    async getTimeSheetWeekById(id) {
        const timeSheetWeek = await TimeSheetWeek.findById(id);
        if (!timeSheetWeek) {
            return null;
        }
        return timeSheetWeek;
    }
    async incrementTimeSheetWeek() {
        const recentTimeSheetWeek = await TimeSheetWeek.find({}).sort('-endDate').limit(1);
        const recentEnd = recentTimeSheetWeek[0].get('endDate', null, {getters: false});
        if (moment(recentEnd).isBefore(moment())) {
            const startDate = moment(recentEnd).add(1, 'day');
            const endDate = startDate.clone().add(6, 'days');
            const newTimeSheetWeek = new TimeSheetWeek({
                startDate: startDate.toDate(),
                endDate: endDate.toDate()
            });
            await newTimeSheetWeek.save()
        }
    }
}
module.exports = TimeSheetWeekService;