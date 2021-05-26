const Transaction = require('mongoose-transactions');
const sharp = require('sharp');
const {Readable} = require('stream');
const parse = require('csv-parse');

const transaction = new Transaction();
const {Employee} = require('../models/employee');
const User = require('../../admin/models/user');
const {PimConfiguration} = require('../models/pim_configuration');
const {OneTimePassword} = require('../../admin/models/one_time_password');
const {sendOneTimePassword} = require('../../../emails/account');
const {CustomField} = require('../models/custom_field');
const {Contact} = require('../models/contact');
const {EidConfiguration} = require('../models/eid_configuration');

const getOptionalFields = async () => {
    const pimConfiguration = await PimConfiguration.findOne({});
    if (!pimConfiguration) {
        return null
    }
    const pimConfObj = pimConfiguration.toObject();
    const pimConfKeys = Object.keys(pimConfObj);
    const optionalFields = [];
    pimConfKeys.forEach((conf_key) => {
        if (pimConfiguration[conf_key] && conf_key !== '_id' && conf_key !== '__v') {
            optionalFields.push(conf_key.substr(5));
        }
    });
    if (optionalFields.length === 0) {
        return [];
    }

    return optionalFields;
}

const getAllowedPersonalKeys = async () => {
    const optionalFields = await getOptionalFields();
    return ['first_name', 'last_name', 'middle_name',
        'license_expiry_date', 'gender', 'marital_status',
        'nationality', 'date_of_birth', ...optionalFields];
}

const createEmployee = async (req, res) => {
    try {
        const keys = Object.keys(req.body);
        console.log(keys);
        const allowedKeys = ['first_name', 'middle_name', 'last_name', 'status', 'create_user', 'email'];
        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        });

        if (!isValidOperation) {
            res.status(400).send({error: 'Unable to create employee'});
            return;
        }

        const employee = new Employee(req.body);
        employee.employee_id = await employee.generateEid(transaction);
        console.log(employee);
        if (req.file) {
            employee.avatar = await sharp(req.file.buffer).resize({width: 200, height: 200}).png().toBuffer();
        }
        console.log(req.body.create_user);
        if (req.body.create_user) {
            const user = new User(req.body);
            user.employee = employee._id;
            user.user_name = employee.employee_id;
            user.password = Math.random().toString(36).substring(2, 9);
            user.role = 'ess';

            transaction.insert('Employee', employee);
            transaction.insert('User', user);
            await transaction.run();
            transaction.clean();
            console.log(user);

            const emp = employee.toObject();
            delete emp.avatar;
            delete emp.__v;

            if (!user.status) {
                res.status(201).send({emp, user});
                return;
            }

            const oneTimePassword = new OneTimePassword({
                user_id: user._id,
                emp_id: employee._id
            });

            const password = await oneTimePassword.generateOneTimePassword();
            if (!password) {
                res.status(201).send({emp, user, email: false});
                return;
            }

            const resetUrl = 'https://localhost:' + process.env.PORT + '/users/' + oneTimePassword._id + '/set_password/' + password;
            const name = employee.last_name.charAt(0).toUpperCase() + employee.last_name.slice(1);
            console.log(resetUrl);

            const isSuccess = await sendOneTimePassword(user.email, name, resetUrl, user.user_name, password+":"+oneTimePassword._id);
            if (isSuccess) {
                console.log('successfully sent reset password link');
                res.status(201).send({emp, user, email: true});
                return;
            }

            res.status(201).send({emp, user, email: false});
        } else {
            await employee.save();
            await transaction.run();
            transaction.clean();
            const emp = employee.toObject();
            delete emp.avatar;
            delete emp.__v;
            delete emp.id;
            res.status(201).send({emp});
        }
    } catch (e) {
        await transaction.rollback();
        transaction.clean();
        res.status(500).send(e);
    }
}


const readMyPersonalDetail = async (req, res) => {
    try {
        const optionalFields = await getOptionalFields();
        if (!optionalFields) {
            res.status(500).send({message: 'could not get optional field'});
            return;
        }

        let str = '';
        optionalFields.forEach((field) => {
            str += ' ' + field;
        });
        const employee = await Employee.findById(req.user.employee).select('first_name last_name middle_name employee_id nic ' +
            'driving_license_no license_expiry_date gender marital_status nationality date_of_birth custom_fields' + str);
        if (!employee) {
            res.status(404).send({message: 'not found'});
        } else {
            const final = employee.toObject();
            delete final.id;
            res.send(final);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

const readEmployeePersonalDetail = async (req, res) => {
    const _id = req.params.emp_id;
    try {
        const optionalFields = await getOptionalFields();
        if (!optionalFields) {
            res.status(500).send({message: 'could not get optional field'});
            return;
        }

        let str = '';
        optionalFields.forEach((field) => {
            str += ' ' + field;
        });

        const employee = await Employee.findById(_id).select('first_name last_name middle_name employee_id nic driving_license_no ' +
            'license_expiry_date gender marital_status nationality date_of_birth custom_fields' + str);
        if (!employee) {
            res.status(404).send({message: 'not found'});
        } else {
            const final = employee.toObject();
            delete final.id;
            res.send(final);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

const updatePersonalDetail = async (req, res, id, allowedKeys, allowedCustomFields) => {
    const keys = Object.keys(req.body);
    const isValidOperation = keys.every((key) => {
        return allowedKeys.includes(key);
    });

    if (!isValidOperation) {
        res.status(400).send({message: 'invalid request'});
    } else {
        const employee = await Employee.findById(id);
        if (!employee) {
            res.status(404).send({message: 'employee not found'});
        } else {
            const defaultKeys = keys.filter((key) => {
                return !allowedCustomFields.includes(key);
            })

            defaultKeys.forEach((key) => {
                employee[key] = req.body[key];
            });

            const customUpdates = keys.filter((cUpdate) => {
                return allowedCustomFields.includes(cUpdate);
            })

            if (!employee.custom_fields) {
                let custom = {};
                for (const update of customUpdates) {
                    custom[update] = await CustomField.validateAField('personal', update, req.body[update]);
                }
                employee.custom_fields = custom;
            }

            for (const update of customUpdates) {
                employee.custom_fields[update] = await CustomField.validateAField('personal', update, req.body[update]);
            }

            employee.markModified('custom_fields');
            await employee.save();
            await employee.populate({
                path: 'nationality',
                select: '-__v'
            }).execPopulate();
            const emp = employee.toObject();
            delete emp.avatar;
            delete emp.__v;
            delete emp.id;
            res.send(emp);
        }
    }
}


const updateMyPersonalDetail = async (req, res) => {
    try {
        const optionalFields = await getOptionalFields();
        if (!optionalFields) {
            res.status(404).send({message: 'optional fields not found'});
            return;
        }

        const restrictedOptionalFields = ['sin', 'ssn'];
        const finalOptionalFields = optionalFields.filter((final) => {
            return !restrictedOptionalFields.includes(final);
        });
        let customFields = await CustomField.getCustomFieldsName('personal');

        let allowedKeys = ['first_name', 'last_name', 'middle_name',
            'license_expiry_date', 'gender', 'marital_status',
            'nationality', 'date_of_birth', ...finalOptionalFields];

        if (customFields) {
            allowedKeys = ['first_name', 'last_name', 'middle_name',
                'license_expiry_date', 'gender', 'marital_status',
                'nationality', 'date_of_birth', ...finalOptionalFields, ...customFields];
        }


        await updatePersonalDetail(req, res, req.user.employee, allowedKeys, customFields);
    } catch (e) {
        res.status(500).send(e);
    }

}

updateEmployeePersonalDetail = async (req, res) => {
    try {
        const optionalFields = await getOptionalFields();
        if (!optionalFields) {
            res.status(404).send({message: 'optional fields not found'});
            return;
        }

        const customFields = await CustomField.getCustomFieldsName('personal');
        const allowedKeys = ['first_name', 'last_name', 'middle_name',
            'license_expiry_date', 'gender', 'marital_status',
            'nationality', 'date_of_birth', 'driving_license_no',
            'nic', ...optionalFields, ...customFields];

        await updatePersonalDetail(req, res, req.params.emp_id, allowedKeys, customFields);
    } catch (e) {
        res.status(500).send(e);
    }


}

const readAProfilePicture = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.emp_id);
        if (!employee || !employee.avatar) {
            res.status(404).send({message: 'could not found'});
            return;
        }

        res.set('Content-Type', 'image/png');
        res.send(employee.avatar);
    } catch (e) {
        res.status(500).send({message: 'an internal error'});
    }
}

const updateProfilePic = async (emp_id, pic) => {
    const employee = await Employee.findById(emp_id);
    if (!employee) {
        return null;
    }

    employee.avatar = await sharp(pic).resize({width: 200, height: 200}).png().toBuffer();
    await employee.save();
    return employee.avatar;
}
const updateMyProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).send({message: 'file not received'});
            return;
        }

        const avatar = await updateProfilePic(req.user.employee, req.file.buffer);
        if (!avatar) {
            res.status(404).send({message: 'employee not found'});
            return;
        }

        res.set('Content-Type', 'image/png');
        res.send(avatar);
    } catch (e) {
        res.status(500).send({message: 'an internal error'});
    }
}

const updateAnEmployeeProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).send({message: 'file not received'});
            return;
        }

        const avatar = await updateProfilePic(req.params.emp_id, req.file.buffer);

        if (!avatar) {
            res.status(404).send({message: 'employee not found'});
            return;
        }

        res.set('Content-Type', 'image/png');
        res.send(avatar);
    } catch (e) {
        res.status(500).send({message: 'internal server error'})
    }
}
const deleteEmployees = async (req, res) => {
    try {
        const ids = req.body.employees;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const final = [];
        for (const id of ids) {
            const employee = await Employee.findById(id).select('-avatar -__v');
            if (employee) {
                employee.remove();
                const obj = employee.toObject();
                delete obj.id;
                final.push(obj);
            }
        }

        if (final.length === 0) {
            res.status(400).send({message: 'none deleted'});
            return;
        }

        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const processFile = async (data) => {
    const records = []
    const header = ['first_name', 'middle_name', 'last_name', 'driving_license_no',
        'license_expiry_date', 'gender', 'marital_status', 'date_of_birth', 'street1',
        'street2', 'city', 'province', 'postal_code', 'home_tel', 'mobile', 'work_tel',
        'work_email', 'other_email', 'status', 'email'];
    const parser = Readable
        .from(data)
        .pipe(parse({
            // CSV options if any
        }));
    for await (const record of parser) {
        // Work with each record
        let recordObj = {};
        for (let i = 0; i < header.length; i++) {
            recordObj[header[i]] = record[i];
        }
        records.push(recordObj)
    }
    return records
}

const addEmployees = async (req, res) => {
    let highestNumber;
    try {
        const eidConfiguration = await EidConfiguration.findOne({});
        highestNumber = eidConfiguration.highest_number;

        const result = await processFile(req.file.buffer.toString());
        const allowedKeys = ['first_name', 'middle_name', 'last_name', 'driving_license_no',
            'license_expiry_date', 'gender', 'marital_status', 'date_of_birth', 'street1',
            'street2', 'city', 'province', 'postal_code', 'home_tel', 'mobile', 'work_tel',
            'work_email', 'other_email', 'status', 'email'];
        const allowedPersonalKeys = ['first_name', 'middle_name', 'last_name', 'driving_license_no',
            'license_expiry_date', 'gender', 'marital_status', 'date_of_birth'];
        const allowedContactKeys = ['street1',
            'street2', 'city', 'province', 'postal_code', 'home_tel', 'mobile', 'work_tel',
            'work_email', 'other_email'];

        if (Object.keys(result[0]).length !== allowedKeys.length) {
            res.status(400).send({message: 'csv header changed'});
            return;
        }

        if (result.length > 101) {
            res.status(400).send({message: 'total count of employees exceeds 100'});
            return;
        }

        const inserted = [];
        let sentEmailCount = 0;
        let failedEmailCount = 0;
        const failedEmails = [];
        let userCount = 0;
        let enabledUserCount = 0;
        let disabledUserCount = 0;

        for (let i = 1; i < result.length; i++) {
            let insertedOne = {};
            const row = result[i];
            const employee = new Employee();
            allowedPersonalKeys.forEach((personalKey) => {
                if (row[personalKey] !== '') {
                    employee[personalKey] = row[personalKey];
                }
            });

            employee.employee_id = await employee.generateEid();
            transaction.insert('Employee', employee);

            let contactObj = {};
            allowedContactKeys.forEach((contactKey) => {
                if (row[contactKey] !== '') {
                    contactObj[contactKey] = row[contactKey];
                }
            })
            if (Object.keys(contactObj).length !== 0) {
                const contact = new Contact({
                    ...contactObj,
                    employee: employee._id
                })
                transaction.insert('Contact', contact);
                const contactToInsert = contact.toObject();
                delete contactToInsert.id;
                delete contactToInsert.__v;
                delete contactToInsert.employee;
                insertedOne.contact = contactToInsert;
            }

            let userObj = {};
            if (row.email !== '') {
                if (row.status === 'enable') {
                    userObj.status = true;
                }
                userObj.email = row.email;
            }

            if (Object.keys(userObj).length !== 0) {
                const user = new User({
                    ...userObj,
                    employee: employee._id,
                    user_name: employee.employee_id,
                    password: Math.random().toString(36).substring(2, 9),
                    role: 'ess'
                })
                transaction.insert('User', user);
                const userToInsert = user.toObject();
                delete userToInsert.id;
                delete userToInsert.__v;
                delete userToInsert.employee;
                delete userToInsert.password;
                delete userToInsert.tokens;
                insertedOne.user = userToInsert;
            }
            const employeeToInsert = employee.toObject();
            delete employeeToInsert.id;
            delete employeeToInsert.__v;
            inserted.push({
                employee: employeeToInsert,
                ...insertedOne
            });
        }
        transaction.run().then(async () => {
            transaction.clean();
            for (const row of inserted) {
                if (row.user) {
                    userCount += 1;
                    if (row.user.status) {
                        enabledUserCount += 1;
                        const oneTimePassword = new OneTimePassword({
                            user_id: row.user._id,
                            emp_id: row.employee._id
                        });

                        await oneTimePassword.generateOneTimePassword().then(async (password) => {
                            const resetUrl = 'https://localhost:' + process.env.PORT + '/users/' + oneTimePassword._id + '/set_password/' + password;
                            const name = row.employee.last_name.charAt(0).toUpperCase() + row.employee.last_name.slice(1);
                            console.log(resetUrl);

                            await sendOneTimePassword(row.user.email, name, resetUrl, row.user.user_name, password).then((isSuccess) => {
                                if (isSuccess) {
                                    console.log(isSuccess)
                                    sentEmailCount += 1;
                                } else {
                                    console.log(isSuccess)
                                    failedEmailCount += 1;
                                    failedEmails.push(row.user.email);
                                }
                            }).catch();
                        });

                    } else {
                        disabledUserCount += 1;
                    }
                }
            }

            res.send({
                data: inserted,
                employeeCount: inserted.length,
                sentEmailCount,
                failedEmailCount,
                failedEmails,
                userCount,
                enabledUserCount,
                disabledUserCount
            })
        }).catch((e) => {
            EidConfiguration.findOne({}).then((eidConfiguration) => {
                eidConfiguration.highest_number = highestNumber;
                eidConfiguration.save();
            });
            transaction.rollback().then(() => {
                transaction.clean();
                const errorOnLine = inserted.length + 1;
                res.status(500).send({
                    message: 'validation failed',
                    row: errorOnLine,
                    error: e
                });
            });
        })
    } catch (e) {
        res.status(500).send(e);
    }
}

//GET /employees?employeeName=JOHN Lesley&
// id=EMP001&
// employmentStatus=5fe601d782db0316fc8736e4&
//jobTitle=5fe5d98d0674df08ac43e5b3&
//subUnit=5fe748335b97b734c870aec5&
//supervisor=5fda5d04b92b9343549066a0&
//include=currentOnly


const queryEmployees = async (req, res) => {
    try {
        const matchEmployee = {};
        if (req.query.employeeName) {
            const lowerCaseFullName = req.query.employeeName.toLowerCase();
            const nameArray = lowerCaseFullName.split(/\s/g);
            const filteredNameArray = nameArray.filter((name) => {
                return name !== '';
            })
            if (filteredNameArray.length === 1) {
                matchEmployee.first_name = filteredNameArray[0];
            }

            if (filteredNameArray.length === 2) {
                matchEmployee.first_name = filteredNameArray[0];
                matchEmployee.last_name = filteredNameArray[1];
            }

            if (filteredNameArray.length > 2) {
                matchEmployee.first_name = filteredNameArray[0];
                matchEmployee.middle_name = filteredNameArray[1];
                matchEmployee.last_name = filteredNameArray[2];
            }
        }

        if (req.query.id) {
            matchEmployee.employee_id = req.query.id;
        }

        let employees;

        if (req.user.role === "admin") {
            employees = await Employee.find(matchEmployee).lean().populate({
                path: 'termination job supervisors',
                populate: {
                    path: 'reason job_title employment_status sub_unit supervisor',
                    select: 'name job_title unit_id first_name last_name middle_name employee_id'
                },
                select: 'date note'
            }).select('first_name last_name middle_name employee_id');
        }

        if (req.user.role === 'ess') {
            const allEmployees = await Employee.find(matchEmployee).lean().populate({
                path: 'termination job supervisors',
                populate: {
                    path: 'reason job_title employment_status sub_unit supervisor',
                    select: 'name job_title unit_id first_name last_name middle_name employee_id'
                },
                select: 'date note'
            }).select('first_name last_name middle_name employee_id');

            employees = allEmployees.filter((employee) => {
                let isMatched = false;
                for (const supervisor of employee.supervisors) {
                    if (supervisor.supervisor._id.toString() === req.user.employee.toString()) {
                        isMatched = true;
                        break;
                    }
                }
                return isMatched;
            })
        }

        if (!employees || employees.length === 0) {
            res.status(404).send({message: 'not found any employees'});
            return;
        }

        let firstFilteredArray = employees;

        if (req.query.include) {
            if (req.query.include.toLowerCase() === 'currentonly') {
                firstFilteredArray = employees.filter((employee) => {
                    return employee.termination.length === 0;
                })
            }

            if (req.query.include.toLowerCase() === 'pastonly') {
                firstFilteredArray = employees.filter((employee) => {
                    return employee.termination.length > 0;
                })
            }
        }

        if (!firstFilteredArray || firstFilteredArray.length === 0) {
            res.status(404).send({message: 'not found any employees'});
            return;
        }

        let secondFilterArray = firstFilteredArray;
        if (req.query.supervisor) {
            secondFilterArray = firstFilteredArray.filter((employee) => {
                let isMatched = false;
                for (const supervisor of employee.supervisors) {
                    if (supervisor.supervisor._id.toString() === req.query.supervisor) {
                        isMatched = true;
                        break;
                    }
                }
                return isMatched;
            })
        }

        if (!secondFilterArray || secondFilterArray.length === 0) {
            res.status(404).send({message: 'not found any employees'});
            return;
        }

        let thirdFilterArray = secondFilterArray;
        if (req.query.jobTitle) {
            thirdFilterArray = secondFilterArray.filter((employee) => {
                if (employee.job.length === 1) {
                    if (employee.job[0].job_title) {
                        return employee.job[0].job_title._id.toString() === req.query.jobTitle;
                    }
                }
            })
        }

        if (!thirdFilterArray || thirdFilterArray.length === 0) {
            res.status(404).send({message: 'not found any employees'});
            return;
        }

        let fourthFilterArray = thirdFilterArray;

        if (req.query.employmentStatus) {
            fourthFilterArray = thirdFilterArray.filter((employee) => {
                if (employee.job.length === 1) {
                    if (employee.job[0].employment_status) {
                        return employee.job[0].employment_status._id.toString() === req.query.employmentStatus;
                    }
                }
            })
        }

        if (!fourthFilterArray || fourthFilterArray.length === 0) {
            res.status(404).send({message: 'not found any employees'});
            return;
        }

        let fifthFilterArray = fourthFilterArray;
        if (req.query.subUnit) {
            fifthFilterArray = fourthFilterArray.filter((employee) => {
                if (employee.job.length === 1) {
                    if (employee.job[0].sub_unit) {
                        return employee.job[0].sub_unit._id.toString() === req.query.subUnit;
                    }
                }
            })
        }

        if (!fifthFilterArray || fifthFilterArray.length === 0) {
            res.status(404).send({message: 'not found any employees'});
            return;
        }
        res.send(fifthFilterArray);
    } catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
    createEmployee,
    readMyPersonalDetail,
    readEmployeePersonalDetail,
    updateMyPersonalDetail,
    updateEmployeePersonalDetail,
    readAProfilePicture,
    updateMyProfilePicture,
    updateAnEmployeeProfilePicture,
    deleteEmployees,
    addEmployees,
    queryEmployees,
    getOptionalFields,
    getAllowedPersonalKeys
}