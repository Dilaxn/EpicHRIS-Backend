

const {Applicant} = require('../models/applicants');

const addApplicant  = async (req, res) => {
    try {
        const applicant = new Applicant({
            ...req.body
        });

        if (!applicant) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await applicant.save();
        const final = applicant.toObject();
        delete final.__v;
        // res.status(201).send(final);
   res.redirect("http://localhost:3001/vacanciesPosts");
    } catch (e) {
        res.status(500).send(e);
    }
}

const readApplicant = async (req, res) => {
    try {
        const applicant = await Applicant.findById(req.params.id).select('-__v');

        if (!applicant) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(applicant);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readAllApplicants = async (req, res) => {
    try {
        const applicants = await Applicant.find({}).select('-__v');
        if (!applicants || applicants.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(applicants);
    } catch (e) {
        res.status(500).send(e);
    }
}

// const updateASkill = async (req, res) => {
//     const updates = Object.keys(req.body);
//     const allowedKeys = ['name', 'description'];
//
//     const isValidOperation = updates.every((update) => {
//         return allowedKeys.includes(update);
//     })
//
//     if (!isValidOperation || updates.length === 0) {
//         res.status(400).send({message: 'invalid request'});
//         return;
//     }
//
//     try {
//         const skill = await Skill.findById(req.params.id).select('-__v');
//
//         if (!skill) {
//             res.status(404).send({message: 'not found'});
//             return;
//         }
//
//         updates.forEach((update) => {
//             skill[update] = req.body[update];
//         });
//
//         await skill.save();
//         res.send(skill);
//     } catch (e) {
//         res.status(500).send(e);
//     }
// }

const deleteApplicants = async (req, res) => {
    try {
        const ids = req.body.applicants;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const response = [];

        for (const id of ids) {
            const applicant = await Applicant.findById(id).select('-__v');

            if (applicant) {
                await applicant.remove();
                response.push(applicant);
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
    addApplicant,
    readAllApplicants,
    readApplicant,
    deleteApplicants
}