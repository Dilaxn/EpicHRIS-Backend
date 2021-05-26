

const {Vacancy} = require('../models/vacancies');

const addVacancy  = async (req, res) => {
    try {
        const vacancy = new Vacancy({
            ...req.body
        });

        if (!vacancy) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await vacancy.save();
        const final = vacancy.toObject();
        delete final.__v;
        res.status(201).send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readVacancy = async (req, res) => {
    try {
        const vacancy = await Vacancy.findById(req.params.id).select('-__v');

        if (!vacancy) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(vacancy);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readAllVacancies = async (req, res) => {
    try {
        const vacancies = await Vacancy.find({}).select('-__v');
        if (!vacancies) {
            res.status(404).send({message: 'not found'});
            return;
        }
        else if(vacancies.length === 0){
            res.send([]);
        }
        res.send(vacancies);
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

const deleteVacancies = async (req, res) => {
    try {
        const ids = req.body.vacancies;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const response = [];

        for (const id of ids) {
            const vacancy = await Vacancy.findById(id).select('-__v');

            if (vacancy) {
                await vacancy.remove();
                response.push(vacancy);
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
    addVacancy,
    readAllVacancies,
    readVacancy,
    deleteVacancies
}