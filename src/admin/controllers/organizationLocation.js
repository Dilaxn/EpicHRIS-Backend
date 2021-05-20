const {OrganizationLocation} = require('../models/organization_location');

const addALocation = async (req, res) => {
    try {
        const location = new OrganizationLocation({
            ...req.body
        });

        if (!location) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await location.save();
        await location.populate({
            path: 'country locale',
            select: 'name local location'
        }).execPopulate();
        const final = location.toObject();
        delete final.__v;
        delete final.id;
        res.status(201).send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const readALocation = async (req, res) => {
    try {
        const location = await OrganizationLocation.findById(req.params.id).populate({
            path: 'country locale',
            select: 'name local location'
        }).select('-__v');

        if (!location) {
            res.status(404).send({message: 'not found location'});
            return;
        }
        const final = location.toObject();
        delete final.id;
        res.send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const queryLocations = async (req, res) => {
    try {
        const queryObj = {
            ...req.query
        }
        delete queryObj.sortBy;
        delete queryObj.skip;
        delete queryObj.limit;

        const allowedQueryKeys = ['name', 'country', 'province', 'city', 'address', 'locale', 'postal_code', 'phone', 'fax'];
        const matchKeys = Object.keys(queryObj);
        const isValidOperation = matchKeys.every((key) => {
            return allowedQueryKeys.includes(key);
        });
        if (!isValidOperation) {
            res.status(400).send({message: 'invalid was request sent'});
            return;
        }

        const match = {};
        const sort = {};

        matchKeys.forEach((key) => {
            if (key === 'name' || key === 'province' || key === 'city' || key === 'address') {
                const regex = new RegExp(req.query[key], 'gm')
                match[key] = regex;
            }else {
                match[key] = req.query[key]
            }
        })

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        const locations = await OrganizationLocation.find({...match}, '-__v', {
            sort,
            skip: parseInt(req.query.skip),
            limit: parseInt(req.query.limit)

        }).populate({
            path: 'country locale number_of_employees',
            select: 'name local location'
        });

        if (!locations || locations.length === 0) {
            res.status(404).send({message: 'not found'})
            return;
        }
        const final = [];
        locations.forEach((location) => {
            const obj = location.toObject();
            delete obj.id;
            final.push(obj);
        })

        res.send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const updateALocation = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedKeys = ['name', 'country', 'province', 'city', 'address', 'locale', 'postal_code', 'phone', 'fax', 'notes'];

    const isValidOperation = updates.every((update) => {
        return allowedKeys.includes(update);
    })

    if (!isValidOperation) {
        res.status(400).send({message: 'invalid request'});
        return;
    }

    try{
        const location = await OrganizationLocation.findById(req.params.id);
        if (!location) {
            res.status(404).send({message: 'not found'});
            return;
        }

        updates.forEach((update) => {
            location[update] = req.body[update];
        });

        await location.save();
        await location.populate({
            path: 'country locale',
            select: 'name local location'
        }).execPopulate();
        const final = location.toObject();
        delete final.__v;
        delete final.id;

        res.send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const deleteMultipleLocation = async (req, res) => {
    try {
        const locations = req.body.locations;

        if (!locations || !Array.isArray(locations) || locations.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const allDel = [];

        for (location of locations) {
            const deleted = await OrganizationLocation.findById(location);
            if (deleted) {
                await deleted.remove();
                const obj = deleted.toObject();
                delete obj.id;
                delete obj.__v;
                allDel.push(obj);
            }
        }

        res.send(allDel);
    }catch (e) {
        res.status(500).send(e);
    }
}


module.exports = {
    addALocation,
    readALocation,
    queryLocations,
    updateALocation,
    deleteMultipleLocation
}