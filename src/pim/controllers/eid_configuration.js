const {EidConfiguration} = require('../models/eid_configuration');

const updateEidConf = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedKeys = ['prefix', 'suffix', 'number_length', 'increase_by'];
    const isValidOperation = updates.every((update) => {
        return allowedKeys.includes(update);
    });

    if (!isValidOperation) {
        res.status(400).send();
        return;
    }

    try {
        const eid_conf = await EidConfiguration.findOne({});
        if (!eid_conf) {
            res.status(404).send();
            return;
        }

        updates.forEach((update) => {
            eid_conf[update] = req.body[update];
        })

        await eid_conf.save();
        res.send(eid_conf);
    }catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
    updateEidConf
}