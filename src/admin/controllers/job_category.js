const {JobCategory} = require('../models/job_category');

const addAJobCategory = async (req, res) => {
    try {
        const jobCategory = new JobCategory({
            ...req.body
        });

        if (!jobCategory) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await jobCategory.save();
        const final = jobCategory.toObject();
        delete final.__v;
        res.status(201).send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readAJobCategory = async (req, res) => {
    try {
        const jobCategory = await JobCategory.findById(req.params.job_category_id).select('-__v');

        if (!jobCategory) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(jobCategory);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readAllJobCategories = async (req, res) => {
    try {
        const jobCategories = await JobCategory.find({}).select('-__v');

        if (!jobCategories || jobCategories.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(jobCategories);
    } catch (e) {
        res.status(500).send(e);
    }
}

const updateAJobCategory = async (req, res) => {
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
        const jobCategory = await JobCategory.findById(req.params.job_category_id);
        if (!jobCategory) {
            res.status(404).send({message: 'not found'});
            return;
        }

        updates.forEach((update) => {
            jobCategory[update] = req.body[update];
        });

        await jobCategory.save();
        const final = jobCategory.toObject();
        delete final.__v;
        res.send(final);

    } catch (e) {
        res.status(500).send(e);
    }
}

const deleteJobCategories = async (req, res) => {
    try {
        const jobCategories = req.body.job_categories;

        if (!Array.isArray(jobCategories) || !jobCategories || jobCategories.length === 0) {
            res.status(404).send({message: 'invalid request'});
            return;
        }

        const response = [];

        for (const jobCategory of jobCategories) {
            const deleted = await JobCategory.findById(jobCategory);

            if (deleted) {
                deleted.remove();
                const obj = deleted.toObject();
                delete obj.__v;
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
    addAJobCategory,
    readAJobCategory,
    readAllJobCategories,
    updateAJobCategory,
    deleteJobCategories
}