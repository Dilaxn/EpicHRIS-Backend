const {SalaryComponent} = require('../models/salary_component');
const {Employee} = require('../models/employee');
const {CustomField} = require('../models/custom_field');

const addASalaryComponentToAnEmployee = async (req, res) => {
    console.log("salary Compo");
    try {
        console.log("got it");
        const keys = Object.keys(req.body);
        const allowedCustomKeys = await CustomField.getCustomFieldsName('salary');
        const allowedKeys = ['pay_grade', 'salary_component', 'pay_frequency', 'currency', 'amount',
            'comment', 'deposit_account_number', 'deposit_account_type', 'deposit_routing_number', 'deposit_amount',
            ...allowedCustomKeys];

        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        });

        if (!isValidOperation || keys.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const customKeys = keys.filter((key) => {
            return allowedCustomKeys.includes(key);
        });

        const defaultKeys = keys.filter((key) => {
            return !customKeys.includes(key);
        })

        let salaryComponentObj = {};

        if (defaultKeys.length > 0) {
            salaryComponentObj.deposit_detail = {};
            defaultKeys.forEach((defaultKey) => {
                switch (defaultKey) {
                    case 'deposit_account_number': {
                        salaryComponentObj.deposit_detail.account_number = req.body[defaultKey];
                        break;
                    }

                    case 'deposit_account_type': {
                        salaryComponentObj.deposit_detail.account_type = req.body[defaultKey];
                        break;
                    }

                    case 'deposit_routing_number': {
                        salaryComponentObj.deposit_detail.routing_number = req.body[defaultKey];
                        break;
                    }

                    case 'deposit_amount': {
                        salaryComponentObj.deposit_detail.amount = req.body[defaultKey];
                        break;
                    }

                    default: {
                        salaryComponentObj[defaultKey] = req.body[defaultKey];
                    }
                }
            })
        }

        if (customKeys.length > 0) {
            salaryComponentObj.custom_fields = {};

            for (const customKey of customKeys) {
                salaryComponentObj.custom_fields[customKey] = await CustomField.validateAField('salary', customKey, req.body[customKey]);
            }
        }
        const salaryComponent = new SalaryComponent({
            ...salaryComponentObj,
            employee: req.params.emp_id
        });

        if (!salaryComponent) {
            res.status(400).send({message: 'could not add'});
            return;
        }

        await salaryComponent.save();

        await salaryComponent.populate({
            path: 'deposit_detail.account_type',
            select: '-__v'
        }).populate({
            path: 'pay_grade',
            select: '-__v'
        }).populate({
            path: 'pay_frequency',
            select: '-__v'
        }).populate({
            path: 'currency',
            select: '-__v'
        }).execPopulate();

        const final = salaryComponent.toObject();
        delete final.__v;
        delete final.id;
        delete final.pay_grade.id;

        res.status(201).send(final);
    } catch (e) {
        res.status(500).send({error: e.message});
    }
}

const readASalaryComponent = async (req, res, emp_id) => {
    try {
        const salaryComponent = await SalaryComponent.findOne({employee: emp_id, _id: req.params.id}).populate({
            path: 'deposit_detail.account_type',
            select: '-__v'
        }).populate({
            path: 'pay_grade',
            select: '-__v'
        }).populate({
            path: 'pay_frequency',
            select: '-__v'
        }).populate({
            path: 'currency',
            select: 'min_salary max_salary',
            populate: {
                path: 'currency_type',
                select: 'code currency'
            }
        }).select('-__v');

        if (!salaryComponent) {
            res.status(404).send({message: 'not found'});
            return;
        }

        const final = salaryComponent.toObject();
        delete final.id;
        delete final.pay_grade.id;
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readASalaryComponentOfMine = async (req, res) => {
    await readASalaryComponent(req, res, req.user.employee);
}

const readASalaryComponentOfAnEmployee = async (req, res) => {
    await readASalaryComponent(req, res, req.params.emp_id);
}

const readAllSalaryComponents = async (req, res, emp_id) => {
    try {
        const employee = await Employee.findById(emp_id).populate({
            path: 'salary_components',
            select: '-__v',
            populate: {
                path: 'deposit_detail.account_type pay_grade pay_frequency currency',
                select: '-__v -countries -number -digits',
                populate: {
                    path: 'currency_type',
                    select: 'code currency'
                }
            }
        }).select('salary_components');
        if (!employee || !employee.salary_components || employee.salary_components.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }

        const final = employee.toObject();
        delete final.id;
        final.salary_components.forEach((salaryComponent) => {
            delete salaryComponent.employee;
            delete salaryComponent.id;
            delete salaryComponent.pay_grade.id;
        })
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readMyAllSalaryComponents = async (req, res) => {
    await readAllSalaryComponents(req, res, req.user.employee);
}

const readAllSalaryComponentsOfAnEmployee = async (req, res) => {
    await readAllSalaryComponents(req, res, req.params.emp_id);
}

const updateASalaryComponentOfAnEmployee = async (req, res) => {
    try {
        const keys = Object.keys(req.body);
        const allowedCustomKeys = await CustomField.getCustomFieldsName('salary');
        const allowedKeys = ['pay_grade', 'salary_component', 'pay_frequency', 'currency', 'amount',
            'comment', 'deposit_account_number', 'deposit_account_type', 'deposit_routing_number', 'deposit_amount',
            ...allowedCustomKeys];

        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        });

        if (!isValidOperation || keys.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const customKeys = keys.filter((key) => {
            return allowedCustomKeys.includes(key);
        });

        const defaultKeys = keys.filter((key) => {
            return !customKeys.includes(key);
        })

        const salaryComponent = await SalaryComponent.findOne({employee: req.params.emp_id, _id: req.params.id});
        if (!salaryComponent) {
            res.status(404).send({message: 'not found'});
            return;
        }

        if (defaultKeys.length > 0) {
            defaultKeys.forEach((defaultKey) => {
                switch (defaultKey) {
                    case 'deposit_account_number': {
                        salaryComponent.deposit_detail.account_number = req.body[defaultKey];
                        break;
                    }

                    case 'deposit_account_type': {
                        salaryComponent.deposit_detail.account_type = req.body[defaultKey];
                        break;
                    }

                    case 'deposit_routing_number': {
                        salaryComponent.deposit_detail.routing_number = req.body[defaultKey];
                        break;
                    }

                    case 'deposit_amount': {
                        salaryComponent.deposit_detail.amount = req.body[defaultKey];
                        break;
                    }

                    default: {
                        salaryComponent[defaultKey] = req.body[defaultKey];
                    }
                }
            })
        }

        if (customKeys.length > 0) {
            if (!salaryComponent.custom_fields) {
                salaryComponent.custom_fields = {};
                for (const customKey of customKeys) {
                    salaryComponent.custom_fields[customKey] = await CustomField.validateAField('salary', customKey, req.body[customKey]);
                }
            }else {
                for (const customKey of customKeys) {
                    salaryComponent.custom_fields[customKey] = await CustomField.validateAField('salary', customKey, req.body[customKey]);
                }
            }

            salaryComponent.markModified('custom_fields');
        }

        await salaryComponent.save();
        await salaryComponent.populate({
            path: 'deposit_detail.account_type',
            select: '-__v'
        }).populate({
            path: 'pay_grade',
            select: '-__v'
        }).populate({
            path: 'pay_frequency',
            select: '-__v'
        }).populate({
            path: 'currency',
            select: 'min_salary max_salary',
            populate: {
                path: 'currency_type',
                select: 'code currency'
            }
        }).execPopulate();

        const final = salaryComponent.toObject();
        delete final.__v;
        delete final.id;
        delete final.pay_grade.id;

        res.send(final);
    } catch (e) {
        res.status(500).send({error: e.message});
    }
}

const deleteSalaryComponentsOfAnEmployee = async (req, res) => {
    try {
        const ids = req.body.salary_components;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const response = [];

        for (const id of ids) {
            const deleted = await SalaryComponent.findOneAndDelete({employee: req.params.emp_id, _id: id}).select('-__v');

            if (deleted) {
                const obj = deleted.toObject();
                delete obj.id;
                response.push(obj);
            }
        }

        if (response.length === 0) {
            res.status(404).send({message: 'none deleted'});
            return;
        }

        res.send(response);
    } catch (e) {
        res.status(500).send(e);
    }
}
module.exports = {
    addASalaryComponentToAnEmployee,
    readASalaryComponentOfMine,
    readASalaryComponentOfAnEmployee,
    readMyAllSalaryComponents,
    readAllSalaryComponentsOfAnEmployee,
    updateASalaryComponentOfAnEmployee,
    deleteSalaryComponentsOfAnEmployee
}