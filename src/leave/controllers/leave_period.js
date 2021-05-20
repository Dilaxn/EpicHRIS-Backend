const {LeavePeriod} = require('../models/leave_period');

const updateLeavePeriodConf = async (req, res) => {
    try {
        const keys = Object.keys(req.body);
        const allowedKeys = ['start_month', 'start_date'];
        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        })
        if (!isValidOperation) {
            res.status(400).send({error: 'Invalid key is added to req.body'});
            return;
        }
        const existingConf = await LeavePeriod.findOne({});
        if (!existingConf) {
            const newConf = new LeavePeriod({
                ...req.body
            });

            await newConf.save();
            const result = newConf.toObject();
            delete result.__v;
            delete result.id;
            res.status(201).send(result);
        }else {
            keys.forEach((key) => {
                existingConf[key] = req.body[key];
            })
            await existingConf.save();
            const final = existingConf.toObject();
            delete final.__v;
            delete final.id;
            res.status(200).send(final);
        }
    }catch (e) {
        res.status(500).send({error: e.message});
    }
}

module.exports = {
    updateLeavePeriodConf
}