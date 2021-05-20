const {Termination} = require('../models/termination');
const User = require('../../admin/models/user');

const terminateAnEmployee = async (req, res) => {

    try {
        const exist = await Termination.findOne({employee: req.params.emp_id});

        if (!exist) {
            const termination = new Termination({
                ...req.body,
                employee: req.params.emp_id
            });

            if (!termination) {
                res.status(400).send({message: 'could not terminate'});
                return;
            }
            await termination.save();
            const user = await User.findOne({employee: termination.employee});
            if (user) {
                user.status = false;
                await user.save();
            }
            await termination.populate({
                path: 'reason',
                select: '-__v'
            }).execPopulate();
            const final = termination.toObject();
            delete final.__v;
            res.status(201).send(final);
            return;
        }

        res.status(400).send({message: 'employee already terminated'});
    }catch (e) {
        res.status(500).send(e);
    }

}

const activateAnEmployee = async (req, res) => {
    try {
        const termination = await Termination.findOne({employee: req.params.emp_id}).populate({
            path: 'reason',
            select: '-__v'
        }).select('-__v');
        if (!termination) {
            res.status(404).send({message: 'employee already activated'});
            return;
        }

        await termination.delete();
        const user = await User.findOne({employee: termination.employee});
        if (user) {
            user.status = true;
            await user.save();
        }
        res.send(termination);
    }catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
    terminateAnEmployee,
    activateAnEmployee
}