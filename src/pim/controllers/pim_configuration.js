const {PimConfiguration} = require('../models/pim_configuration');

const updatePimConfiguration = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedKeys = ['show_nick_name', 'show_smoker', 'show_military_service', 'show_ssn', 'show_sin'];

    const isValidOperation = updates.every((update) => {
        return allowedKeys.includes(update);
    });

    if (!isValidOperation) {
        res.status(400).send();
        return;
    }

    try {
        const pim_configuration = await PimConfiguration.findOne({});
        if (!pim_configuration) {
            res.status(404).send();
            return;
        }

        updates.forEach((update) => {
            pim_configuration[update] = req.body[update];
        })

        await pim_configuration.save();
        res.send(pim_configuration);
    }catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
    updatePimConfiguration
}