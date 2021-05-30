const moment = require('moment');
const fs = require('fs');
const path = require('path');
const {LeavePeriodConfiguration} = require('./leavePeriodConfigurationModel');
const configPath = path.join(__dirname, './config.json');
const ValidationService = require('../ValidationComponent/ValidationService');
const LeavePeriodService = require('../LeavePeriodComponent/LeavePeriodService');

class LeavePeriodConfigurationService {
    #validationService;
    #filePath;
    #leavePeriodService;

    constructor(validationServiceClass = ValidationService, configFilePath = configPath, LeavePeriodServiceClass = LeavePeriodService) {
        this.#validationService = new validationServiceClass();
        this.#filePath = configFilePath;
        this.#leavePeriodService = new LeavePeriodServiceClass();
    }

    async initializeLeavePeriodConfiguration() {
        const conf = await this.getLeavePeriodConfiguration();
        if (typeof conf === 'object' && conf.startMonth && conf.startDay) {
            return null;
        }
        const now = moment();
        const newConf = {startMonth: now.format('MMMM'), startDay: now.get('date')};
        fs.writeFileSync(this.#filePath, JSON.stringify(newConf))
        return newConf;
    }

    async updateLeavePeriodConfiguration(leavePeriodConfigurationObj) {
        if (typeof leavePeriodConfigurationObj !== 'object' || leavePeriodConfigurationObj === null) {
            return {success: false, message: 'configuration can should be an object'}
        }
        const keys = Object.keys(leavePeriodConfigurationObj);
        const isValidKeys = keys.every((key) => {
            return ['startMonth', 'startDay'].includes(key)
        })
        if (!isValidKeys) {
            return {success: false, message: 'configuration object has invalid key'};
        }
        const newConfig = new LeavePeriodConfiguration(leavePeriodConfigurationObj);
        await newConfig.validate();
        const config = await this.getLeavePeriodConfiguration();
        const month = newConfig.startMonth ? newConfig.startMonth : config.startMonth;
        const day = newConfig.startDay ? newConfig.startDay : config.startDay;
        if (!this.#validationService.isValidDay(month, day)) {
            return {success: false, message: 'validation failed on config object provided'};
        }
        const updatedConfiguration = {startMonth: month, startDay: day};
        fs.writeFileSync(this.#filePath, JSON.stringify(updatedConfiguration));
        const updatedLeavePeriod = await this.#leavePeriodService.updateLeavePeriod(updatedConfiguration)
        return {success: true, data: {updatedConfiguration, updatedLeavePeriod}};
    }

    async getLeavePeriodConfiguration() {
        if (fs.existsSync(this.#filePath)) {
            const bufferString = fs.readFileSync(this.#filePath).toString();
            return JSON.parse(bufferString);
        }
        return null;
    }
}

module.exports = LeavePeriodConfigurationService;
