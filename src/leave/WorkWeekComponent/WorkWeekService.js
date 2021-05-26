const fs = require('fs');
const path = require('path');
const {WorkWeek} = require('./workWeekModel');
const configPath = path.join(__dirname, '/config.json');
class WorkWeekService {
    #configPath;
    constructor(config = configPath) {
        this.#configPath = config;
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
}
module.exports = WorkWeekService