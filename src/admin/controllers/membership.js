const {Membership} = require('../models/membership');


const addAMembership = async (req, res) => {
    try {
        const membership = new Membership({
            ...req.body
        });

        if (!membership) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await membership.save();
        const final = membership.toObject();
        delete final.__v;
        res.status(201).send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const readAMembership = async (req, res) => {
    try {
        const membership = await Membership.findById(req.params.id).select('-__v');
        if (!membership) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(membership);
    }catch (e) {
        res.status(500).send(e);
    }
}

const readAllMemberships = async (req, res) => {
    try {
        const memberships = await Membership.find({}).select('-__v');
        if (!memberships || memberships.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(memberships);
    }catch (e) {
        res.status(500).send(e);
    }
}

const updateAMembership = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedKeys = ['name'];
    const isValidOperation = updates.every((update) => {
        return allowedKeys.includes(update);
    });

    if (!isValidOperation || updates.length === 0) {
        res.status(400).send({message: 'invalid request'});
        return;
    }

    try {
        const membership = await Membership.findById(req.params.id).select('-__v');
        if (!membership) {
            res.status(404).send({message: 'membership type not found'});
            return;
        }

        updates.forEach((update) => {
            membership[update] = req.body[update];
        })

        await membership.save();

        res.send(membership);
    }catch (e) {
        res.status(500).send(e);
    }
}

const deleteMemberships = async (req, res) => {
    try {
        const ids = req.body.memberships;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const response = [];

        for (const id of ids) {
            const membership = await Membership.findById(id).select('-__v');
            if (membership) {
                await membership.remove();
                response.push(membership);
            }
        }

        if (response.length === 0) {
            res.status(404).send({message: 'none deleted'});
            return;
        }

        res.send(response);
    }catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
    addAMembership,
    readAMembership,
    readAllMemberships,
    updateAMembership,
    deleteMemberships
}