const Transaction = require('mongoose-transactions');
const {WorkShift} = require('../models/work_shift');
const {generateNestedObject} = require('../../pim/controllers/employee_report');
const {Employee} = require('../../pim/models/employee');

const transaction = new Transaction();

const convertTimeToSeconds = (time) => {
    if (typeof time === 'string') {
        if (isNaN(time)) {
            if (time.match(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/gm)) {
                const timeArray = time.split(':');
                if (timeArray.length === 2) {
                    return parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60;
                } else if (timeArray.length === 3) {
                    return parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60 + parseInt(timeArray[2]);
                }
            }
            return time;
        }
        return time;
    }

    return time;
}

const addAWorkShift = async (req, res) => {
    try {
        const keys = Object.keys(req.body);
        const allowedKeys = ['shift_name', 'work_hours-from', 'work_hours-to', 'employees'];
        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        });

        if (!isValidOperation) {
            res.status(400).send({message: 'invalid request sent'});
            return;
        }
        let workShiftObj = {};

        keys.forEach((key) => {
            const subKeys = key.split('-');
            if (key === 'work_hours-from' || key === 'work_hours-to') {
                generateNestedObject(workShiftObj, subKeys, convertTimeToSeconds(req.body[key]));
            } else {
                generateNestedObject(workShiftObj, subKeys, req.body[key]);
            }
        });
        const workShift = new WorkShift({
            ...workShiftObj
        });

        await workShift.save()
        const final = workShift.toObject();
        delete final.id;
        delete final.__v;
        res.status(201).send(final);
    } catch (e) {
        res.status(500).send({error: e.message});
    }
}

const readAllWorkShifts = async (req, res) => {
    try {
        const workShifts = await WorkShift.find({}).populate({
            path: 'employees',
            select: 'first_name middle_name last_name employee_id'
        }).select('shift_name work_hours employees');
        if (!workShifts) {
            res.status(404).send({message: 'could not find work shifts'});
            return;
        }

        const result = [];
        workShifts.forEach((workShift) => {
            const obj = workShift.toObject();
            delete obj.id;
            result.push(obj);
        })

        res.send(result);
    } catch (e) {
        res.status(500).send({error: e.message});
    }
}

const readAWorkShiftForEmployee = async (emp_id) => {
    const workShift = await WorkShift.findOne({employees: emp_id}).select('-__v');
    if (!workShift) {
        return null;
    }

    const obj = workShift.toObject();
    delete obj.id;
    delete obj.employees;
    return obj;
}

const readMyWorkShift = async (req, res) => {
    try {
        const workShift = await readAWorkShiftForEmployee(req.user.employee);
        if (!workShift) {
            res.status(404).send({message: 'you are not assigned to any work shifts'});
            return;
        }
        res.send(workShift);
    } catch (e) {
        res.status(500).send({error: e.message});
    }
}

const readAWorkShiftOfAnEmployee = async (req, res) => {
    try {
        const workShift = await readAWorkShiftForEmployee(req.params.emp_id);
        if (!workShift) {
            res.status(404).send({message: 'The employee not assigned to a work shift'});
            return;
        }

        res.send(workShift);
    } catch (e) {
        res.status(500).send({error: e.message});
    }
}

const readAWorkShift = async (req, res) => {
    try {
        const workShift = await WorkShift.findById(req.params.id).populate({
            path: 'employees',
            select: 'employee_id first_name last_name middle_name'
        }).select('-__v');
        if (!workShift) {
            res.status(404).send({message: 'could not found'});
            return;
        }

        const workShiftObj = workShift.toObject();
        delete workShiftObj.id;
        if (workShiftObj.employees) {
            workShiftObj.employees.forEach((employee) => {
                delete employee.id;
            })
        }
        res.send(workShiftObj);
    } catch (e) {
        res.status(500).send({error: e.message});
    }
}

const readAllEmployeesNotAssignedToWorkShift = async (req, res) => {
    try {
        const employees = await Employee.find({}).lean().select('employee_id first_name middle_name last_name');
        const result = [];
        for (const employee of employees) {
            const workShift = await readAWorkShiftForEmployee(employee._id);
            if (workShift === null) {
                result.push(employee);
            }
        }
        res.send(result);
    } catch (e) {
        res.status(500).send({error: e.message});
    }
}

const updateAWorkShift = async (req, res) => {
    try {
        const keys = Object.keys(req.body);
        const allowedKeys = ['shift_name', 'work_hours-from', 'work_hours-to', 'employees'];
        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        });

        if (!isValidOperation) {
            res.status(400).send({message: 'invalid request sent'});
            return;
        }

        let workShiftObj = {};

        keys.forEach((key) => {
            if (key === 'shift_name') {
                workShiftObj.shift_name = req.body[key];
            } else if (key === 'work_hours-from') {
                workShiftObj['work_hours.from'] = convertTimeToSeconds(req.body[key]);
            } else if (key === 'work_hours-to') {
                workShiftObj['work_hours.to'] = convertTimeToSeconds(req.body[key]);
            }
        });

        if (keys.includes('employees') && Array.isArray(req.body.employees)) {

            for (const id of req.body.employees) {
                const workShift = await WorkShift.findOne({employees: id});
                if (workShift) {
                    transaction.update('WorkShift',workShift._id, {
                        $pull: {
                            employees: id
                        }
                    }, {
                        new: true
                    });
                }
            }

            transaction.update('WorkShift',req.params.id, {
                $set: {
                    ...workShiftObj,
                    employees: req.body.employees
                }
            }, {new: true, select: '-__v'});

            transaction.run().then((data) => {
                transaction.clean();
                res.send(data[data.length - 1]);
            }).catch((e) => {
                transaction.rollback().then(() => {
                    transaction.clean();
                    res.status(500).send(e);
                })
            })


            return;
        }

        const updatedWorkShift = await WorkShift.findByIdAndUpdate(req.params.id, {
            $set: {
                ...workShiftObj
            }
        }, {new: true}).select('-__v').populate({
            path: 'employees',
            select: 'first_name middle_name last_name employee_id'
        });

        res.send(updatedWorkShift);

    } catch (e) {
        transaction.rollback().then((data) => {
            transaction.clean();
        })
        res.status(500).send({error: e.message});
    }
}

const deleteWorkShifts = async (req, res) => {
    try {
        const ids = req.body.work_shifts;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'invalid request sent'});
            return;
        }

        const removed = [];

        for (const id of ids) {
            const workShift = await WorkShift.findById(id).select('-__v');
            if (workShift) {
                await workShift.remove();
                removed.push(workShift);
            }
        }

        res.send({removed});

    }catch (e) {
        res.status(500).send({error: e.message});
    }
}


module.exports = {
    addAWorkShift,
    readAllWorkShifts,
    readMyWorkShift,
    readAWorkShiftOfAnEmployee,
    readAWorkShift,
    readAllEmployeesNotAssignedToWorkShift,
    updateAWorkShift,
    deleteWorkShifts
}