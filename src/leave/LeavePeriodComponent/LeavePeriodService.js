const moment = require('moment');
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../LeavePeriodConfigurationComponent/config.json');
const {LeavePeriod} = require('./leavePeriodModel');

class LeavePeriodService {
    #leavePeriodConfigurationPath;
    constructor(leavePeriodConfigurationPath = configPath) {
        this.#leavePeriodConfigurationPath = leavePeriodConfigurationPath;
    }
    async addALeavePeriod() {
        const {current, future} = await this.getCurrentAndFutureLeavePeriod();
        const newEndDate = moment(future.endDate).add(1, 'y').toDate();
        const newLeavePeriod = new LeavePeriod({
            startDate: future.endDate,
            endDate: newEndDate,
            status: 'future'
        });
        await newLeavePeriod.save();
        future.status = 'current'
        await future.save();
        current.status = 'past';
        await current.save();
        return {past: current, current: future, future: newLeavePeriod};
    }
    async initializeLeavePeriod() {
        const existing = await this.getCurrentAndFutureLeavePeriod()
        if (!existing.current && !existing.future) {
            const configJson = fs.readFileSync(this.#leavePeriodConfigurationPath).toString();
            const leavePeriodConfig = JSON.parse(configJson);
            const now = moment();
            let endDate;
            const temp = now.clone().month(leavePeriodConfig.startMonth).set('date', leavePeriodConfig.startDay);
            if (temp.isAfter(now)) {
                endDate = temp.clone().toDate();
            } else {
                endDate = temp.clone().add(1, 'y').toDate();
            }
            const newCurrent = new LeavePeriod({
                startDate: Date.now(),
                endDate,
                status: 'current'
            });
            await newCurrent.save();
            const newFuture = new LeavePeriod({
                startDate: newCurrent.endDate,
                endDate: moment(newCurrent.endDate).add(1, 'y').toDate(),
                status: 'future'
            })
            await newFuture.save();
            return {
                current: newCurrent,
                future: newFuture
            };
        }

    }
    async getCurrentAndFutureLeavePeriod() {
        const currentLeavePeriod = await LeavePeriod.findOne({status: 'current'});
        const futureLeavePeriod = await LeavePeriod.findOne({status: 'future'});
        return {
            current: currentLeavePeriod,
            future: futureLeavePeriod,
        }
    }
    async updateLeavePeriod(leavePeriodConfiguration) {
        const {current, future} = await this.getCurrentAndFutureLeavePeriod();
        const temp = moment().month(leavePeriodConfiguration.startMonth).set('date', leavePeriodConfiguration.startDay);
        if (temp.isAfter(moment(current.startDate))) {
            current.endDate = temp.toDate();
            future.startDate = temp.clone().toDate();
            future.endDate = temp.clone().add(1, 'y').toDate();
            await current.save();
            await future.save();
            return {current, future};
        }
        const newCurrentEnd = temp.clone().add(1, 'y');
        current.endDate = newCurrentEnd.toDate();
        await current.save();
        future.startDate = newCurrentEnd.toDate();
        future.endDate = newCurrentEnd.clone().add(1, 'y').toDate();
        await future.save();
        return {current, future};
    }
    async getAllLeavePeriods() {
        const leavePeriods = await LeavePeriod.find({});
        if (leavePeriods.length === 0) {
            return {success: false, message: 'no leave period found'};
        }
        return {success: true, data: leavePeriods};
    }
    async findLeavePeriod(id) {
        const leavePeriod = await LeavePeriod.findById(id);
        if (!leavePeriod) {
            return null;
        }
        return leavePeriod;
    }
}

module.exports = LeavePeriodService;