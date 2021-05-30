const {LeaveType} = require('./leaveTypeModel');
class LeaveTypeService {
    async addALeaveType(leaveTypeObject) {
        const leaveType = new LeaveType(leaveTypeObject);
        await leaveType.save();
        return leaveType;
    }
    async readAllLeaveTypes() {
        const leaveTypes = await LeaveType.find();
        if (leaveTypes.length === 0) {
            return {success: false, message: 'not found leave types'};
        }
        return {success: true, data: leaveTypes};
    }
    async queryLeaveTypes(queryOption) {
        const filter = {};
        if (queryOption.leaveTypeName) {
            filter.leaveTypeName = queryOption.leaveTypeName;
        }
        if (queryOption.isEntitlementSituational) {
            filter.isEntitlementSituational = queryOption.isEntitlementSituational;
        }
        const leaveTypes = await LeaveType.find(filter);
        if (leaveTypes.length === 0) {
            return null;
        }
        return leaveTypes;
    }
    async updateALeaveType(id, update) {
        const allowedKeys = ['leaveTypeName', 'isEntitlementSituational'];
        const keys = Object.keys(update);
        const isValidOps = keys.every((key) => {
            return allowedKeys.includes(key);
        })
        if (!isValidOps) {
            return {success: false, message: 'Invalid Keys...'};
        }
        const leaveType = await LeaveType.findById(id);
        if (!leaveType) {
            return {success: false, message: 'leave type not found'};
        }
        keys.forEach((key) => {
            leaveType[key] = update[key];
        })
        await leaveType.save();
        return {success: true, updated: leaveType};
    }
    async deleteLeaveTypes(leaveTypeIdObj) {
        if (!leaveTypeIdObj.id) {
            return {success: false, message: 'could not find id property'};
        }
        if (Array.isArray(leaveTypeIdObj.id) && leaveTypeIdObj.id.length > 0) {
            const deleted = await LeaveType.deleteMany({_id: {$in: leaveTypeIdObj.id}});
            if (deleted.deletedCount > 0) {
                return {success: true, deletedCount: deleted.deletedCount};
            }
            return {success: false, message: 'Could not delete any leave types'};
        }
        const deleted = await LeaveType.findByIdAndDelete(leaveTypeIdObj.id);
        if(!deleted) {
            return {success: false, message: 'invalid leave type id sent'};
        }
        return {success: true, deletedCount: 1};
    }
}

module.exports = LeaveTypeService;