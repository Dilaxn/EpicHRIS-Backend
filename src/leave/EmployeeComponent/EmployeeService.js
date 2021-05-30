const {Employee} = require('../../pim/models/employee');
class EmployeeService {
    async getAnEmployee(id) {
        const employee = await Employee.findById(id);
        if (!employee) {
            return null;
        }
        return employee;
    }
    async findSubordinates(employee) {
        const found = await Employee.findById(employee).populate({
            path: 'subordinates',
            select: '-__v'
        }).select('subordinates');
        return found.subordinates.map((subordinate) => subordinate.subordinate.toString())
    }
}
module.exports = EmployeeService;