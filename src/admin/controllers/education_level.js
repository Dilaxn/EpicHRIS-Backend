const {EducationLevel} = require('../models/education_level');

const addAnEducationLevel = async (req, res) => {
    try {
        const educationLevel = new EducationLevel ({
            ...req.body
        });

        if (!educationLevel) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await educationLevel.save();
        const final = educationLevel.toObject();
        delete final.__v;
        res.status(201).send(final);

    }catch (e) {
        res.status(500).send(e);
    }
}

const readAEducationLevel = async (req, res) => {
    try {
        const educationLevel = await EducationLevel.findById(req.params.id).select('-__v');

        if (!educationLevel) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(educationLevel);
    }catch (e) {
        res.status(500).send(e);
    }
}

const readAllEducationLevel = async (req, res) => {
    try {
        const educationLevels = await EducationLevel.find({}).select('-__v');

        if (!educationLevels || educationLevels.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(educationLevels);
    }catch (e) {
        res.status(500).send(e);
    }
}

const updateAnEducationLevel = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedKeys =['name'];

    const isValidOperation = updates.every((update) => {
        return allowedKeys.includes(update);
    })

    if (!isValidOperation || updates.length === 0) {
        res.status(400).send({message: 'invalid operation'});
        return;
    }

    try {
        const educationLevel = await EducationLevel.findById(req.params.id).select('-__v');
        if (!educationLevel) {
            res.status(404).send({message: 'education level not found'});
            return;
        }

        updates.forEach((update) => {
            educationLevel[update] = req.body[update];
        });

        await educationLevel.save();
        res.send(educationLevel);
    }catch (e) {
        res.status(500).send(e);
    }
}

const deleteEducationLevels = async (req, res) => {
    try {
        const ids = req.body.education_levels;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const response = [];

        for (const id of ids) {
            const deleted = await EducationLevel.findById(id).select('-__v');
            if (deleted) {
                await deleted.remove();
                response.push(deleted);
            }
        }

        if (response.length === 0) {
            res.status(404).send({message: 'none deleted'});
            return
        }

        res.send(response);
    }catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
    addAnEducationLevel,
    readAEducationLevel,
    readAllEducationLevel,
    updateAnEducationLevel,
    deleteEducationLevels
}