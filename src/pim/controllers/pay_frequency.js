const {PayFrequency} = require('../models/pay_frequency');

const addAPayFrequency = async (req, res) => {
    try {
        const payFrequency = new PayFrequency({
            ...req.body
        });

        if (!payFrequency) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await payFrequency.save();
        const final = payFrequency.toObject();
        delete final.__v;
        res.status(201).send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const deletePayFrequencies = async (req, res) => {
    try {
        const ids = req.body.pay_frequencies;

        if (!ids || !Array.isArray(ids), ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const response = [];

        for (const id of ids) {
            const payFrequency = await PayFrequency.findById(id).select('-__v');

            if (payFrequency) {
                await payFrequency.remove();
                response.push(payFrequency);
            }
        }

        if (response.length === 0) {
            res.status(404).send({message: 'no data deleted'});
            return;
        }

        res.send(response);
    }catch (e) {
        res.status(500).send(e);
    }
}

const readAllPayFrequencies = async (req, res) => {
    try {
        const payFrequencies = await PayFrequency.find({}).select('-__v');
        if (!payFrequencies || payFrequencies.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        res.send(payFrequencies);
    }catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
    addAPayFrequency,
    deletePayFrequencies,
    readAllPayFrequencies
}