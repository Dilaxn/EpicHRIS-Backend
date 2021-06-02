const {Employee} = require('../models/employee');
const {ReportTo} = require('../models/report_to');
const {CustomField} = require('../models/custom_field');

const addAReportTo = async (req, res, myRole) => {
    try {
        const keys = Object.keys(req.body);
        if (keys.length === 0) {
            res.status(400).send({message: 'body field can not be empty'});
            return;
        }

        const allowedCustomKeys = await CustomField.getCustomFieldsName('report_to');
        const allowedKeys = ['supervisor', 'subordinate', 'method', ...allowedCustomKeys];

        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        })

        if (!isValidOperation) {
            res.status(400).send({message: 'invalid body fields'});
            return;
        }

        const customKeys = keys.filter((key) => {
            return allowedCustomKeys.includes(key);
        })

        const defaultKeys = keys.filter((key) => {
            return !customKeys.includes(key);
        })

        let reportToObject = {};

        if (defaultKeys.length > 0) {
            defaultKeys.forEach((defaultKey) => {
                reportToObject[defaultKey] = req.body[defaultKey];
            });
        }
        if (customKeys.length > 0) {
            reportToObject.custom_fields = {};
            for (const customKey of customKeys) {
                    reportToObject.custom_fields[customKey] = await CustomField.validateAField('report_to', customKey, req.body[customKey]);
            }
        }

        const reportTo = new ReportTo({
            ...reportToObject,
            [myRole]: req.params.emp_id
        });
        if (!reportTo || reportTo.subordinate.toString() === reportTo.supervisor.toString()) {

            res.status(400).send({message: 'invalid request'});
            return;
        }

        const supervisor = await Employee.findById(reportTo.supervisor);
        const subordinate = await Employee.findById(reportTo.subordinate);

        if (!supervisor || !subordinate) {
            res.status(400).send({message: 'invalid request'});
            return;
        }


        const exist = await ReportTo.findOne({supervisor: reportTo.supervisor, subordinate: reportTo.subordinate});
        if (exist) {
            res.status(400).send({message: 'already added'});
            return;
        }

        await ReportTo.findOneAndDelete({supervisor: reportTo.subordinate, subordinate: reportTo.supervisor});
        reportTo.markModified('custom_fields');
        await reportTo.save();
        await reportTo.populate({
            path: 'supervisor method subordinate',
            select: 'first_name last_name employee_id name'
        }).execPopulate();
        const final = reportTo.toObject();
        delete final.__v;
        delete final.subordinate.id;
        delete final.supervisor.id;
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const addSupervisor = async (req, res) => {
    await addAReportTo(req, res, 'subordinate');
}

const updateAReportTo = async (req, res, subordinate, supervisor) => {
    try {
        const keys = Object.keys(req.body);
        const allowedCustomKeys = await CustomField.getCustomFieldsName('report_to');
        const allowedKeys = ['method', ...allowedCustomKeys];

        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        });

        if (!isValidOperation) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const reportTo = await ReportTo.findOne({subordinate: subordinate, supervisor: supervisor});
        if (!reportTo) {
            res.status(404).send({message: 'not found'});
        } else {
            const customKeys = keys.filter((key) => {
                return allowedCustomKeys.includes(key);
            })

            const defaultKeys = keys.filter((key) => {
                return !customKeys.includes(key);
            })

            if (defaultKeys.length > 0) {
                defaultKeys.forEach((defaultKey) => {
                    reportTo[defaultKey] = req.body[defaultKey];
                });
            }

        if (customKeys.length > 0) {
            if (!reportTo.custom_fields) {
                let customFieldsObj = {};
                for (const customKey of customKeys) {
                        customFieldsObj[customKey] = await CustomField.validateAField('report_to', customKey, req.body[customKey]);
                }

                reportTo.custom_fields = customFieldsObj;
            }else {
                for (const customKey of customKeys) {
                        reportTo.custom_fields[customKey] = await CustomField.validateAField('report_to', customKey, req.body[customKey]);
                }
            }

            reportTo.markModified('custom_fields');
        }

            await reportTo.save();
            await reportTo.populate({
                path: 'supervisor method subordinate',
                select: 'first_name last_name employee_id name'
            }).execPopulate();

            const final = reportTo.toObject();
            delete final.__v;
            delete final.supervisor.id;
            delete final.subordinate.id;
            res.send(final);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

const updateASupervisorForAnEmployee = async (req, res) => {
    await updateAReportTo(req, res, req.params.emp_id, req.params.sup_id);
}

const deleteAReportTo = async (req, res, subordinate, supervisor) => {
    try {
        const reportTo = await ReportTo.findOneAndDelete({
            supervisor: supervisor,
            subordinate: subordinate
        });

        if (!reportTo) {
            res.status(404).send({message: 'could not found'});
        } else {
            await reportTo.populate({
                path: 'supervisor method subordinate',
                select: 'first_name last_name employee_id name'
            }).execPopulate();

            const final = reportTo.toObject();
            delete final.__v;
            delete final.supervisor.id;
            delete final.subordinate.id;
            res.send(final);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

const deleteSupervisor = async (req, res) => {
    await deleteAReportTo(req, res, req.params.emp_id, req.params.sup_id);
}

const readSupervisors = async (req, res, emp_id) => {
    try {
        const employee = await Employee.findById(emp_id).populate({
            path: 'supervisors',
            populate: {
                path: 'supervisor method',
                select: 'first_name last_name name employee_id'
            },
            select: '-__v'
        }).select('supervisors');

        if (!employee || employee.supervisors.length === 0) {
            res.status(404).send({message: 'could not found'});
        } else {
            const final = employee.toObject();
            delete final.id;
            final.supervisors.forEach((supervisor) => {
                delete supervisor.subordinate;
                delete supervisor.supervisor.id;
            });
            res.send(final);
        }

    } catch (e) {
        res.status(500).send(e);
    }
}

const getAllSupervisors = async (req, res) => {
    await readSupervisors(req, res, req.params.emp_id);
}

const getMyAllSupervisors = async (req, res) => {
    await readSupervisors(req, res, req.user.employee);
}

const readASupervisorForAnEmployee = async (req, res) => {
    try {
        const reportTo = await ReportTo.findOne({
            subordinate: req.params.emp_id,
            supervisor: req.params.sup_id
        }).populate({
            path: 'supervisor method',
            select: 'first_name last_name name employee_id'
        }).select('-__v');


        if (!reportTo) {
            res.status(404).send({message: 'not found'});
        } else {
            res.send(reportTo);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}


const addASubordinateToAnEmployee = async (req, res) => {
    await addAReportTo(req, res, 'supervisor');

}

const updateASubordinateForAnEmployee = async (req, res) => {
    await updateAReportTo(req, res, req.params.sub_id, req.params.emp_id);
}

const deleteSubordinate = async (req, res) => {
    await deleteAReportTo(req, res, req.params.sub_id, req.params.emp_id);
}

const readSubordinates = async (req, res, emp_id) => {
    try {
        console.log("empid"+emp_id)
        const employee = await Employee.findById(emp_id).populate({
            path: 'subordinates',
            populate: {
                path: 'subordinate method',
                select: 'first_name last_name employee_id name'
            },
            select: 'subordinate method custom_fields'
        }).select('subordinates');


        if (!employee || employee.subordinates.length === 0) {
            res.status(404).send({message: 'not found'});
        } else {
            const final = employee.toObject();
            delete final.id;


            final.subordinates.forEach((subordinate) => {
                delete subordinate.supervisor;
                if (subordinate.subordinate) {
                    delete subordinate.subordinate.id;
                }
            });
            res.send(final);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

const readMyAllSubordinates = async (req, res) => {
    await readSubordinates(req, res, req.user.employee);
}

const readAllSubordinatesForAnEmployee = async (req, res) => {
    await readSubordinates(req, res, req.params.emp_id);
}

const readASubordinateForAnEmployee = async (req, res) => {
    try {
        const reportTo = await ReportTo.findOne({
            subordinate: req.params.sub_id,
            supervisor: req.params.emp_id
        }).populate({
            path: 'subordinate method',
            select: 'first_name last_name employee_id name'
        }).select('subordinate method custom_fields');

        if (!reportTo) {
            res.status(404).send({message: 'could not found'});
        } else {
            const final = reportTo.toObject();
            delete final.subordinate.id;
            res.send(final);
        }
    } catch (e) {
        res.status(500).send(e);
    }

}


module.exports = {
    addSupervisor,
    deleteSupervisor,
    getAllSupervisors,
    getMyAllSupervisors,
    updateASupervisorForAnEmployee,
    addASubordinateToAnEmployee,
    updateASubordinateForAnEmployee,
    deleteSubordinate,
    readMyAllSubordinates,
    readAllSubordinatesForAnEmployee,
    readASubordinateForAnEmployee,
    readASupervisorForAnEmployee
};