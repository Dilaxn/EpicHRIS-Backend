const jwt = require('jsonwebtoken');
const User = require('../src/admin/models/user');
const {Employee} = require('../src/pim/models/employee');

const supervisorOrAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.AUTH_SECRET);
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token, status: true});
        if (!user) {
            throw new Error();
        }

        if (user.role === 'admin') {
            req.token = token;
            req.user = user;
            console.log("jiii")
            next();
        }else{
            const employee = await Employee.findById(user.employee).populate({
                path: 'subordinates',
                select: 'subordinate'
            }).select('subordinates');

            if (employee.subordinates.length > 0) {
                const reportTo = employee.subordinates.find((reportTo) => {
                    return reportTo.subordinate.toString() === req.params.emp_id;
                });

                if (reportTo.subordinate.toString() === req.params.emp_id) {
                    req.token = token;
                    req.user = user;
                    console.log("yeah got it")
                    next();
                }else {
                    throw new Error();
                }

            }else {
                throw new Error();
            }
        }

    }catch (e) {
        res.status(401).send({ error: 'Please authenticate'});
    }
}

module.exports = supervisorOrAdmin;