const fs = require('fs');
const path = require('path');
const moment = require('moment');
const {WorkWeek} = require('./workWeekModel');
const {WorkDayConfiguration} = require('./workDayConfigurationModel');
const configPath = path.join(__dirname, '/config.json');
const workDayConfigurationPath = path.join(__dirname, '/workDayConfiguration.json');

class WorkWeekService {
    #configPath;
    #workDayConfigPath;
    constructor(config = configPath, workDayConf = workDayConfigurationPath) {
        this.#configPath = config;
        this.#workDayConfigPath = workDayConf;
    }
    async updateWorkWeek(workWeek) {
        const keys = Object.keys(workWeek);
        const allowedKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const isValidOps = keys.every((key) => {
            return allowedKeys.includes(key);
        })
        if (!isValidOps) {
            throw new Error('invalid keys in update object');
        }
        const newConfig = new WorkWeek({
            ...workWeek
        });
        await newConfig.validate();
        const newConfObj = newConfig.toObject();
        delete newConfObj._id;
        const data = fs.readFileSync(this.#configPath).toString();
        const config = JSON.parse(data);
        Object.keys(newConfObj).forEach((keyToUpdate) => {
            config[keyToUpdate] = newConfObj[keyToUpdate];
        })
        fs.writeFileSync(this.#configPath, JSON.stringify(config));
        return config;
    }
    async getWorkDayInfo(date) {
        const day = moment(date, 'YYYY-MM-DD').format('dddd').toLowerCase();
        if (!day) {
            return null;
        }
        const configJSON = fs.readFileSync(this.#configPath).toString();
        const dayType = JSON.parse(configJSON)[day];
        return {
            day,
            dayType
        }
    }
    async getWorkDayConfiguration() {
        if (fs.existsSync(this.#workDayConfigPath)) {
            const dataJSON = fs.readFileSync(this.#workDayConfigPath).toString();
            const configuration = JSON.parse(dataJSON);
            if (typeof configuration === 'object' && configuration !== null) {
                if (configuration.hasOwnProperty('halfMorning') && configuration.hasOwnProperty('halfEvening')) {
                    const halfM = configuration.halfMorning;
                    const halfE = configuration.halfEvening;
                    if (halfM.hasOwnProperty('from') && halfM.hasOwnProperty('to') && halfE.hasOwnProperty('from') && halfE.hasOwnProperty('to')) {
                        return configuration;
                    }
                }
            }
        }
        return null;
    }

    async getTotalWorkingDayTime () {
        const conf = await this.getWorkDayConfiguration()
        const HM = conf.halfMorning.to - conf.halfMorning.from;
        const HE = conf.halfEvening.to - conf.halfEvening.from;
        return HM + HE;
    }

    async initializeWorkDayConfiguration() {
        if (await this.getWorkDayConfiguration()) {
            return null;
        }
        const workDayConfiguration = new WorkDayConfiguration({
            halfMorning: {
                from: moment.duration(8, 'hours').asMilliseconds(),
                to: moment.duration(12, 'hours').asMilliseconds()
            },
            halfEvening: {
                from: moment.duration(13, "hours").asMilliseconds(),
                to: moment.duration(17, 'hours').asMilliseconds()
            }
        })
        await workDayConfiguration.validate();
        fs.writeFileSync(this.#workDayConfigPath, JSON.stringify(workDayConfiguration));
        return workDayConfiguration;
    }
}

module.exports = WorkWeekService