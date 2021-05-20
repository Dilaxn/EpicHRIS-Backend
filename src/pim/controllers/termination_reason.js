const {TerminationReason} = require('../models/termination_reason');

const addATerminationReason = async (req, res) => {
    try {
        const termination_reason = new TerminationReason({
            ...req.body
        });

        if (!termination_reason) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await termination_reason.save();
        const final = termination_reason.toObject();
        delete final.__v;

        res.status(201).send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const readATerminationReason = async (req, res) => {
    try {
        const terminationReason = await TerminationReason.findById(req.params.id).select('-__v');

        if (!terminationReason) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(terminationReason);
    }catch (e) {
        res.status(500).send(e);
    }
}

const readAllTerminationReason = async (req, res) => {
    try {
        const terminationReasons = await TerminationReason.find({}).select('-__v');

        if (!terminationReasons) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(terminationReasons);
    }catch (e) {
        res.status(500).send(e);
    }
}

const updateATerminationReason = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedKeys = ['name'];

    const isValidOperation = updates.every((update) => {
        return allowedKeys.includes(update)
    });

    if (!isValidOperation) {
        res.status(400).send({message: 'invalid request'});
        return;
    }

    try {
        const terminationReason = await TerminationReason.findById(req.params.id);

        if (!terminationReason) {
            res.status(404).send({message: 'not found'});
            return;
        }
        updates.forEach((update) => {
            terminationReason[update] = req.body[update];
        })

        await terminationReason.save();
        const final = terminationReason.toObject();
        delete final.__v;
        res.send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const deleteMultipleTerminationReasons = async (req, res) => {
    const ids = req.body.termination_reasons;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        res.status(400).send({message: 'invalid request'});
        return;
    }

    try {
        let response = [];
        for(const id of ids) {
            const deleted = await TerminationReason.findById(id);
            if (deleted) {
                await deleted.remove();
                const obj = deleted.toObject();
                delete obj.__v;
                response.push(obj);
            }
        }

        if (response.length === 0) {
            res.status(404).send({message: 'none of the termination reason deleted'});
            return;
        }

        res.send(response);
    }catch (e) {
        res.status(500).send(e);
    }
}


module.exports = {
    addATerminationReason,
    readATerminationReason,
    readAllTerminationReason,
    updateATerminationReason,
    deleteMultipleTerminationReasons
}