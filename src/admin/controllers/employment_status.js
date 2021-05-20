const {EmploymentStatus} = require('../models/employment_status');

const addAnEmploymentStatus = async (req, res) => {
    try {
        const employment_status = new EmploymentStatus({
            ...req.body
        });

        if (!employment_status) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await employment_status.save();
        const final = employment_status.toObject();
        delete final.__v;
        res.status(201).send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const readAnEmploymentStatus = async (req, res) => {
    try {
        const employmentStatus = await EmploymentStatus.findById(req.params.employment_status_id).select('-__v');

        if (!employmentStatus) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(employmentStatus);
    }catch (e) {
        res.status(500).send(e);
    }
}

const readAllEmploymentStatus = async (req, res) => {
    try {
        const employmentStatuses = await EmploymentStatus.find({}).select('-__v');

        if (!employmentStatuses || employmentStatuses.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(employmentStatuses);
    }catch (e) {
        res.status(500).send(e);
    }
}

const updateAnEmployment_Status = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedKeys = ['name'];

    const isValidOperation = updates.every((update) => {
        return allowedKeys.includes(update);
    });

    if (!isValidOperation) {
        res.status(400).send({message: 'invalid request'});
        return;
    }

    try {
        const employment_status = await EmploymentStatus.findById(req.params.employment_status_id).select('-__v');
        if (!employment_status) {
            res.status(404).send({message: 'not found'});
            return;
        }

        updates.forEach((update) => {
            employment_status[update] = req.body[update];
        });

        await employment_status.save();
        res.send(employment_status);

    }catch (e) {
        res.status(500).send(e);
    }
}

const deleteEmploymentStatuses = async (req, res) => {
    try {
        const employment_statuses = req.body.employment_statuses;

        if (!Array.isArray(employment_statuses) || !employment_statuses || employment_statuses.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const response = [];

        for (const employment_status of employment_statuses) {
            const deleted = await EmploymentStatus.findById(employment_status);

            if (deleted) {
                deleted.remove();
                response.push(deleted);
            }
        }

        if (response.length === 0) {
            res.status(404).send({message: 'none deleted'});
            return;
        }

        res.send(response);
    }catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
    addAnEmploymentStatus,
    readAnEmploymentStatus,
    readAllEmploymentStatus,
    updateAnEmployment_Status,
    deleteEmploymentStatuses
}