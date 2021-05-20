const {LeaveType} = require('../models/leave_type');

const addALeaveType = async (req, res) => {
    try {
        const leaveType = new LeaveType({
            ...req.body
        });
        await leaveType.save();
        const final = leaveType.toObject();
        delete final.id;
        delete final.__v;
        res.status(201).send(final);
    }catch (e) {
        res.status(500).send({error: e.message});
    }
}

const readAllLeaveTypes = async (req, res) => {
    try {
        const leaveTypes = await LeaveType.find({}).select('-__v');
        if (!leaveTypes || leaveTypes.length === 0) {
            res.status(404).send({message: 'No leave types found'});
            return;
        }
        const final = JSON.parse(JSON.stringify(leaveTypes));
        final.forEach((leaveType) => {
            delete leaveType.id;
        })

        res.status(200).send(final);

    }catch (e) {
        res.status(500).send({error: e.message});
    }
}

const updateALeaveType = async (req, res) => {
    try {
        const keys = Object.keys(req.body);
        const allowedKeys = ['leave_type_name', 'is_entitlement_situational'];
        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        })

        if (!isValidOperation) {
            res.status(400).send({error: 'Invalid key field added to body'});
            return;
        }

        const updated = await LeaveType.findByIdAndUpdate(req.params.id, {...req.body}, {new: true}).select('-__v');
        if (!updated) {
            res.status(500).send({error: 'Something went wrong, could not update'});
            return;
        }

        const final = updated.toObject();
        delete final.id;
        res.status(200).send(final);
    }catch (e) {
        res.status(500).send({message: e.message});
    }
}

const deleteLeaveTypes = async (req, res) => {
    try {
        const idsToBeDeleted = req.body.leave_types;
        if (!idsToBeDeleted || !Array.isArray(idsToBeDeleted) || idsToBeDeleted.length === 0) {
            res.status(400).send({message: 'Invalid request'});
            return;
        }
        const deleted = [];
        for (const id of idsToBeDeleted) {
            const leaveType = await LeaveType.findById(id).select('-__v');
            if(leaveType) {
                leaveType.remove();
                const deletedLeaveType = leaveType.toObject();
                delete deletedLeaveType.id;
                deleted.push(leaveType);
            }
        }

        if (deleted.length === 0) {
            res.status(404).send({message: 'No leave types deleted'});
            return;
        }

        res.status(200).send(deleted);
    }catch (e) {
        res.status(500).send({error: e.message});
    }
}
module.exports = {
    addALeaveType,
    readAllLeaveTypes,
    updateALeaveType,
    deleteLeaveTypes
}