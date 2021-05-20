const {Job} = require('../models/job');
const {Employee} = require('../models/employee');
const {CustomField} = require('../models/custom_field');

const createNewJob = async (req, res, keys, allowedCustomKeys) => {
    const customKeys = keys.filter((key) => {
        return allowedCustomKeys.includes(key);
    });

    const defaultKeys = keys.filter((key) => {
        return !allowedCustomKeys.includes(key) && key !== 'update_contract_detail';
    });

    let jobObj = {};
    if (defaultKeys.length > 0) {
        for (const defaultKey of defaultKeys) {
            if (defaultKey === 'contract_start_date') {
                if (!jobObj.contract) {
                    jobObj.contract = {};
                    jobObj.contract.start_date = req.body[defaultKey];
                    continue;
                }
                jobObj.contract.start_date = req.body[defaultKey];
                continue;
            }

            if (defaultKey === 'contract_end_date') {
                if (!jobObj.contract) {
                    jobObj.contract = {};
                    jobObj.contract.end_date = req.body[defaultKey];
                    continue;
                }
                jobObj.contract.end_date = req.body[defaultKey];
                continue;
            }
            jobObj[defaultKey] = req.body[defaultKey];
        }
    }

    if (customKeys.length > 0) {
        jobObj.custom_fields = {};
        for (const customKey of customKeys) {
            jobObj.custom_fields[customKey] = await CustomField.validateAField('job', customKey, req.body[customKey]);
        }
    }

    const job = new Job({
        ...jobObj,
        employee: req.params.emp_id
    });

    if (!job) {
        res.status(400).send({message: 'invalid request'});
        return;
    }

    if (req.file) {
        job.contract.detail.file = req.file.buffer;
        job.contract.detail.file_name = req.file.originalname;
    }

    await job.save();
    await job.populate({
        path: 'job_title employment_status job_category sub_unit location',
        select: '-job_specification.file -__v',
        options: {autopopulate: false},
        populate: {
            path: 'country locale',
            select: 'name local location'
        }
    }).execPopulate();

    const response = job.toObject();
    delete response.id;
    delete response.__v;

    if (!job.contract.detail.file) {
        res.send(response);
        return;
    }
    delete response.contract.detail.file;
    res.status(201).send(response);
}

const readAJob = async (req, res, emp_id) => {
    try {
        const employee = await Employee.findById(emp_id).populate({
            path: 'job',
            select: '-contract.detail.file -__v',
            populate: {
                path: 'job_title employment_status job_category sub_unit location',
                select: '-job_specification.file -__v',
                options: {autopopulate: false},
                populate: {
                    path: 'country locale',
                    select: 'name local location'
                }
            }

        }).select('job');

        if (!employee || !employee.job || employee.job.length < 1) {
            res.status(404).send({message: 'not found'});
            return;
        }
        let final = {}
        final.employee_id = employee._id;
        final.job = employee.job[0].toObject();
        delete final.job.id;
        delete final.job.location.id;
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readMyJob = async (req, res) => {
    await readAJob(req, res, req.user.employee);
}

const readContractDoc = async (req, res, emp_id) => {
    try {
        const job = await Job.findOne({employee: emp_id});

        if (!job || !job.contract.detail) {
            res.status(404).send({message: 'no contract detail'});
            return;
        }

        res.set('Content-Type', 'application/pdf');
        res.send(job.contract.detail.file);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readMyContract = async (req, res) => {
    await readContractDoc(req, res, req.user.employee);
}

const readAnEmployeeJob = async (req, res) => {
    await readAJob(req, res, req.params.emp_id);
}

const readAContract = async (req, res) => {
    await readContractDoc(req, res, req.params.emp_id);
}

const updateAnEmployeeJob = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedCustomUpdates = await CustomField.getCustomFieldsName('job');
        const allowedKeys = ['job_title', 'employment_status', 'job_category', 'joined_date', 'sub_unit',
            'location', 'contract_start_date', 'contract_end_date', 'update_contract_detail', ...allowedCustomUpdates];

        const isValidOperation = updates.every((update) => {
            return allowedKeys.includes(update);
        });

        if (!isValidOperation) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const job = await Job.findOne({employee: req.params.emp_id});
        if (!job) {
            await createNewJob(req, res, updates, allowedCustomUpdates);
            return;
        }

        const customUpdates = updates.filter((update) => {
            return allowedCustomUpdates.includes(update);
        });

        const defaultUpdates = updates.filter((update) => {
            return !allowedCustomUpdates.includes(update);
        })

        let newDefaultUpdates = defaultUpdates;

        if (defaultUpdates.includes('update_contract_detail')) {
            const action = req.body.update_contract_detail;

            if (action === 'delete') {
                job.contract.detail.file = undefined;
                job.contract.detail.file_name = undefined;
            } else if (action === 'replace') {
                if (req.file) {
                    job.contract.detail.file = req.file.buffer;
                    job.contract.detail.file_name = req.file.originalname;
                }
            }

            newDefaultUpdates = defaultUpdates.filter((defaultUpdate) => {
                return defaultUpdate !== 'update_contract_detail'
            });
        }

        if (newDefaultUpdates.length > 0) {
            for (const newDefaultUpdate of newDefaultUpdates) {
                if (newDefaultUpdate === 'contract_start_date') {
                    job.contract.start_date = req.body[newDefaultUpdate];
                    continue;
                }

                if (newDefaultUpdate === 'contract_end_date') {
                    job.contract.end_date = req.body[newDefaultUpdate];
                    continue;
                }

                job[newDefaultUpdate] = req.body[newDefaultUpdate];
            }
        }

        if (customUpdates.length > 0) {
            if (!job.custom_fields) {
                job.custom_fields = {};
            }

            for (const customUpdate of customUpdates) {
                job.custom_fields[customUpdate] = await CustomField.validateAField('job', customUpdate, req.body[customUpdate]);
            }

            job.markModified('custom_fields');
        }

        await job.save();
        await job.populate({
            path: 'job_title employment_status job_category sub_unit location',
            select: '-job_specification.file -__v',
            options: {autopopulate: false},
            populate: {
                path: 'country locale',
                select: 'name local location'
            }
        }).execPopulate();

        const response = job.toObject();
        delete response.id;
        delete response.__v;

        if (!job.contract.detail.file) {
            res.send(response);
            return;
        }
        delete response.contract.detail.file;
        res.send(response);

    } catch (e) {
        res.status(500).send(e);
    }
}


module.exports = {
    readMyJob,
    readMyContract,
    readAnEmployeeJob,
    readAContract,
    updateAnEmployeeJob
}