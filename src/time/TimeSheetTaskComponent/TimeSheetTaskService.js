const {TimeSheetTask} = require('./timeSheetTaskModel');
class TimeSheetTaskService {
    async saveTasks(tasks, timeSheetId) {
        const validatedTasks = [];
        for (const task of tasks) {
            const found = await this.findATimeSheetTask(task, timeSheetId);
            if (found) {
                found.projectName = task.projectName ? task.projectName : found.projectName;
                found.activity = task.activity ? task.activity : found.activity;
                found.allocatedHours = task.allocatedHours ? task.allocatedHours : found.allocatedHours;
                await found.validate();
                validatedTasks.push(found);
            }else {
                const newTask = new TimeSheetTask({
                    ...task,
                    timeSheet: timeSheetId
                });
                await newTask.validate();
                validatedTasks.push(newTask);
            }
        }
        if (validatedTasks.length === 0) {
            return [];
        }
        const ids = validatedTasks.map((validatedTask) => validatedTask._id);
        await TimeSheetTask.deleteMany({timeSheet: timeSheetId, _id: {$nin: ids}});
        const saved = [];
        for (const validatedTask of validatedTasks) {
            await validatedTask.save();
            saved.push(validatedTask);
        }
        if (saved.length === 0) {
            return [];
        }
        return saved;
    }
    async findATimeSheetTask(task, timeSheetId) {
        if (!task.hasOwnProperty('projectName') || !task.hasOwnProperty('activity')) {
            return null;
        }
        const found = await TimeSheetTask.findOne({timeSheet: timeSheetId, projectName: task.projectName, activity: task.activity});
        if (!found) {
            return null;
        }
        return found;
    }
}
module.exports = TimeSheetTaskService;