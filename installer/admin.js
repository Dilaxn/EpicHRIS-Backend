const {Employee} = require('../src/pim/models/employee');
const User = require('../src/admin/models/user');

const createAdmin = async () => {
    const employee = await Employee.findOne({employee_id: '000'});
    const admin = await User.findOne({user_name: 'admin'});

    if (!employee && !admin) {
        console.log('creating admin employee');
        const employee = new Employee({
            "first_name": "Admin",
            "middle_name": "Admin",
            "last_name": "Admin",
            "employee_id": "000"
        });
        await employee.save();

        const user = new User({
            "user_name": "admin",
            "password": "123456",
            "role": "admin",
            "status": true,
            "email": "admin@hrm.com",
            employee: employee._id
        })
        await user.save();
        console.log({employee, user});
    }else if (employee && admin) {
        console.log('admin already exist');
    }else if (!employee && admin) {
        await User.findOneAndDelete({user_name: 'admin'});
        console.log('admin user deleted');
        const employee = new Employee({
            "first_name": "Admin",
            "middle_name": "Ad",
            "last_name": "Admin",
            "employee_id": "000"
        });
        await employee.save();

        const user = new User({
            "user_name": "admin",
            "password": "123456",
            "role": "admin",
            "status": true,
            "email": "admin@hrm.com",
            employee: employee._id
        })
        await user.save();
        console.log({employee, user});
    }else if (employee && !admin) {
        await Employee.findOneAndDelete({employee_id: '000'});
        console.log('employee 000 deleted');
        const employee = new Employee({
            "first_name": "Admin",
            "middle_name": "Ad",
            "last_name": "Admin",
            "employee_id": "000"
        });
        await employee.save();

        const user = new User({
            "user_name": "admin",
            "password": "123456",
            "role": "admin",
            "status": true,
            "email": "admin@hrm.com",
            employee: employee._id
        })
        await user.save();
        console.log({employee, user});
    }
}

module.exports = {
    createAdmin
}