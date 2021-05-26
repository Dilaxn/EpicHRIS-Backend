const {Entitlement} = require('./leaveEntitlementModel');
const {Employee} = require('../../pim/models/employee');
class LeaveEntitlementService {
    #allowedKeys;
    constructor() {
        this.#allowedKeys = ['leaveType', 'leavePeriod', 'entitlement', 'employee'];
    }
    async addAnEntitlement(entitlement) {
        if (typeof entitlement === 'object' && entitlement !== null) {
            const keys = Object.keys(entitlement);
            const isValidOps = keys.every((key) => {
                return this.#allowedKeys.includes(key);
            });
            if (!isValidOps) {
                return {success: false, message: 'invalidKeys are exist'};
            }
            const newEntitlement = new Entitlement({
                ...entitlement
            })
            if (await this.isEntitlementExist(newEntitlement.employee, newEntitlement.leaveType, newEntitlement.leavePeriod)) {
                return {success: false, message: 'Entitlement already exist'};
            }
            await newEntitlement.save();
            await newEntitlement.populate({
                path: 'leaveType leavePeriod employee',
                select: 'isEntitlementSituational leaveTypeName startDate endDate status first_name last_name employee_id'
            }).execPopulate();
            return {success: true, data: newEntitlement};
        }
        return {success: false, message: 'entitlement should be an object'};
    }
    async isEntitlementExist(employee, leaveType, leavePeriod) {
        const entitlement = await Entitlement.find({employee, leaveType, leavePeriod});
        return entitlement.length > 0;

    }
    async addEntitlements(employees, entitlement) {
        if (Array.isArray(employees) && employees.length > 0) {
            const result = [];
            for (const id of employees) {
                if (await Employee.findById(id)) {
                    entitlement.employee = id;
                    const added = await this.addAnEntitlement(entitlement);
                    if (added.success) {
                        result.push(added.data)
                    }
                }
            }
            if (result.length === 0) {
                return {success: false, message: 'could not add any entitlement'};
            }
            return {success: true, data: result};
        }
        if (typeof employees === 'string') {
            entitlement.employee = employees;
            return await this.addAnEntitlement(entitlement);
        }
        return {success: false, message: 'invalid employee id has been sent'};
    }
    async queryEntitlement(employee, queryOption) {
        const filter = {employee}
        if (typeof queryOption === 'object' && queryOption !== null) {
            if (queryOption.leaveType) {
                filter.leaveType = queryOption.leaveType;
            }
            if (queryOption.leavePeriod) {
                filter.leavePeriod = queryOption.leavePeriod;
            }
        }
        const entitlements = await Entitlement.find(filter).populate({
            path: 'leaveType leavePeriod employee',
            select: 'isEntitlementSituational leaveTypeName startDate endDate status first_name last_name employee_id'
        });
        if (entitlements.length === 0) {
            return {success: false, message: 'could not found'};
        }
        return {success: true, data: entitlements};
    }
    async updateEntitlement(entitlement, update) {
        if (typeof update !== 'object' || update === null) {
            return {success: false, message: 'update should be an object'};
        }
        const allowedKeys = ['leavePeriod', 'entitlement'];
        const keys = Object.keys(update);
        const isValidOps = keys.every((key) => {
            return allowedKeys.includes(key);
        })
        if (!isValidOps) {
            return {success: false, message: 'invalid property exist in update object'};
        }
        const found = await Entitlement.findById(entitlement);
        if (!found) {
            return {success: false, message: 'entitlement not found'};
        }
        keys.forEach((key) => {
            found[key] = update[key];
        })
        await found.save();
        await found.populate({
            path: 'leaveType leavePeriod employee',
            select: 'isEntitlementSituational leaveTypeName startDate endDate status first_name last_name employee_id'
        }).execPopulate();
        return {success: true, data: found};
    }
    async deleteEntitlements(entitlementObj) {
        if (typeof entitlementObj === 'object' && entitlementObj !== null) {
            if (!entitlementObj.entitlement) {
                return {success: false, message: 'entitlement property not found'};
            }
            if (Array.isArray(entitlementObj.entitlement) && entitlementObj.entitlement.length > 0) {
                const deleted = await Entitlement.deleteMany({_id: {$in: entitlementObj.entitlement}});
                if (deleted.deletedCount > 0) {
                    return {success: true, deletedCount: deleted.deletedCount};
                }
                return {success: false, message: 'entitlement not found'};
            }
            if (typeof entitlementObj.entitlement === 'string') {
                const deleted = await Entitlement.findByIdAndDelete(entitlementObj.entitlement);
                if (!deleted) {
                    return {success: false, message: 'entitlement not found'};
                }
                return {success: true, deletedCount: 1};
            }
            return {success: false, message: 'invalid entitlement property'};
        }
        return {success: false, message: 'argument type did not match'};
    }
}
module.exports = LeaveEntitlementService;