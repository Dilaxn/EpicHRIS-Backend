const {WorkWeek} = require('../models/work_week');

const updateWorkWeekConfiguration = async (req, res) => {
    try {
        const keys = Object.keys(req.body);
        const allowedKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        })

        if (!isValidOperation) {
            res.status(400).send({message: 'invalid key added to request body'});
            return;
        }
        const workWeek = await WorkWeek.findOne({}).select('-__v');
        if (!workWeek) {
            res.status(500).send({message: 'something went wrong, could not fetch existing work week conf'});
            return;
        }

        keys.forEach((key) => {
            workWeek[key] = req.body[key];
        })
        await workWeek.save();
        const updated = workWeek.toObject();
        delete updated.id;
        res.status(200).send(updated);
    }catch (e) {
        res.status(500).send({message: e.message});
    }
}
const readWorkWeekConfiguration = async (req, res) => {
    try {
        const workWeek = await WorkWeek.findOne({}).select('-__v');
        if (!workWeek) {
            res.status(404).send({message: 'could not found work week configuration'});
            return;
        }
        const final = workWeek.toObject();
        delete final.id;
        res.status(200).send(final);

    }catch (e) {
        res.status({message: e.message});
    }
}


module.exports = {
    updateWorkWeekConfiguration,
    readWorkWeekConfiguration
}