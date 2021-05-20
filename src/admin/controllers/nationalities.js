const {Nationality} = require('../models/nationality');

const addANationality = async (req, res) => {
    try {
        const nationality = new Nationality({
            ...req.body
        });

        if (!nationality) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await nationality.save();
        const final = nationality.toObject();
        delete final.__v;
        res.status(201).send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const readAllNationalities = async (req, res) => {
    try {
        const nationalities = await Nationality.find({}).select('-__v');
        if (!nationalities || nationalities.length === 0) {
            res.status(404).send({message: 'nationalities not found'});
            return;
        }

        res.send(nationalities);
    }catch (e) {
        res.status(500).send(e);
    }
}

const deleteNationalities = async (req, res) => {
    try {
        const ids = req.body.nationalities;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const response = [];
        for (const id of ids) {
            const deleted = await Nationality.findById(id).select('-__v');
            if (deleted) {
                deleted.remove();
                response.push(deleted);
            }
        }

        if (response.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(response);
    }catch (e) {
        res.status(500).send(e);
    }
}


module.exports = {
    addANationality,
    readAllNationalities,
    deleteNationalities
}