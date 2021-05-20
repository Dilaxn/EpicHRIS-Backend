const {Skill} = require('../models/skill');

const addASkill = async (req, res) => {
    try {
        const skill = new Skill({
            ...req.body
        });

        if (!skill) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await skill.save();
        const final = skill.toObject();
        delete final.__v;
        res.status(201).send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readASkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id).select('-__v');

        if (!skill) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(skill);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readAllSkills = async (req, res) => {
    try {
        const skills = await Skill.find({}).select('-__v');
        if (!skills || skills.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(skills);
    } catch (e) {
        res.status(500).send(e);
    }
}

const updateASkill = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedKeys = ['name', 'description'];

    const isValidOperation = updates.every((update) => {
        return allowedKeys.includes(update);
    })

    if (!isValidOperation || updates.length === 0) {
        res.status(400).send({message: 'invalid request'});
        return;
    }

    try {
        const skill = await Skill.findById(req.params.id).select('-__v');

        if (!skill) {
            res.status(404).send({message: 'not found'});
            return;
        }

        updates.forEach((update) => {
            skill[update] = req.body[update];
        });

        await skill.save();
        res.send(skill);
    } catch (e) {
        res.status(500).send(e);
    }
}

const deleteSkills = async (req, res) => {
    try {
        const ids = req.body.skills;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const response = [];

        for (const id of ids) {
            const skill = await Skill.findById(id).select('-__v');

            if (skill) {
                await skill.remove();
                response.push(skill);
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
    addASkill,
    readASkill,
    readAllSkills,
    updateASkill,
    deleteSkills
}