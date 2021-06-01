const {TimeSheetAction} = require('./timeSheetActionModel');
class TimeSheetActionService {
    async createAnAction(action, performedBy, comment) {
        return new TimeSheetAction({
            action,
            performedBy,
            comment
        });
    }

}

module.exports = TimeSheetActionService;