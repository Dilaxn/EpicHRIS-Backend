const {Employee} = require('../../pim/models/employee');
class EmployeeService {
    async getAnEmployee(id) {
        const employee = await Employee.findById(id);
        if (!employee) {
            return null;
        }
        return employee;
    }
}
module.exports = EmployeeService;