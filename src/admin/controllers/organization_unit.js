const mongoose = require('mongoose');
const {OrganizationUnit} = require('../models/organization_unit');

const addAnOrganizationUnit = async (req, res) => {
    try {
        const keys = Object.keys(req.body);
        const allowedKeys = ['unit_id', 'name', 'description', 'parent'];

        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        });

        if (!isValidOperation || keys.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const organizationUnit = new OrganizationUnit({
            ...req.body
        });

        if (!organizationUnit || !organizationUnit.parent || !mongoose.Types.ObjectId.isValid(organizationUnit.parent)) {
            res.status(400).send({message: 'could not create the unit'});
            return;
        }
        const parent = await OrganizationUnit.findById(organizationUnit.parent, {}, {autopopulate: false});
        if (!parent) {
            res.status(404).send({message: 'could not create the unit'});
            return;
        }

        organizationUnit.level = parent.level + 1;
        await organizationUnit.save();

        parent.my_children.push(organizationUnit._id);
        await parent.save();

        const final = organizationUnit.toObject();
        delete final.__v;
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readAnOrganizationUnit = async (req, res) => {
    try {
        const organization_unit = await OrganizationUnit.findById(req.params.id, {}, {autopopulate: false}).populate({
            path: 'my_children parent',
            options: {autopopulate: false},
            select: '-__v'
        }).select('-__v');
        if (!organization_unit) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(organization_unit);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readAllOrganizationUnits = async (req, res) => {
    try {
        const organizationUnits = await OrganizationUnit.find({}, {}, {autopopulate: false}).populate({
            path: 'parent',
            options: {autopopulate: false},
            select: '-__v'
        }).select('-__v');

        if (!organizationUnits || organizationUnits.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(organizationUnits);
    } catch (e) {
        res.status(500).send(e);
    }
};

// const getPopulateObject = (pathName, topLevel) => {
//     const populateObject = {
//         path: 'my_children'
//     }
//
//     for (let i = 0; i < (topLevel.level - 1); i++) {
//         let str = 'populate';
//         let pop = populateObject;
//         for (let r = 0; r < i + 1; r++) {
//             pop[str] = {
//                 path: 'my_children'
//             };
//
//             pop = pop[str];
//         }
//     }
//
//     return populateObject;
// }

// const getPopulatedObjectArgForId = (pathName, topLevel) => {
//     const populateObject = {
//         path: 'my_children',
//         select: '_id'
//     }
//
//     for (let i = 0; i < (topLevel.level - 1); i++) {
//         let str = 'populate';
//         let pop = populateObject;
//         for (let r = 0; r < i + 1; r++) {
//             pop[str] = {
//                 path: 'my_children',
//                 select: '_id'
//             };
//
//             pop = pop[str];
//         }
//     }
//
//     return populateObject;
// }

const readAPopulateOrganizationUnit = async (req, res) => {

    try {
        const organizationUnit = await OrganizationUnit.findById(req.params.id).select('-__v');
        if (!organizationUnit) {
            req.status(404).send({message: 'not found'});
            return;
        }

        res.send(organizationUnit);
    } catch (e) {
        res.status(500).send(e);
    }
}

const updateAnOrganizationUnit = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedKeys = ['unit_id', 'name', 'description'];

    const isValidOperation = updates.every((update) => {
        return allowedKeys.includes(update);
    });

    if (!isValidOperation) {
        res.status(400).send({message: 'invalid request'});
        return;
    }

    try {
        const organizationUnit = await OrganizationUnit.findById(req.params.id, {}, {autopopulate: false}).select('-__v');

        if (!organizationUnit) {
            res.status(404).send({message: 'organization unit not found'});
            return;
        }

        updates.forEach((update) => {
            organizationUnit[update] = req.body[update];
        });

        await organizationUnit.save();
        await organizationUnit.depopulate('my_children');

        res.send(organizationUnit);
    } catch (e) {
        res.status(500).send(e);
    }
}

const findAllByKey = (obj, keyToFind) => {
    return Object.entries(obj)
        .reduce((acc, [key, value]) => (key === keyToFind)
            ? acc.concat(value)
            : (typeof value === 'object')
                ? acc.concat(findAllByKey(value, keyToFind))
                : acc
            , [])
}

const deleteAnOrganizationUnit = async (req, res) => {
    try {
        const organizationUnit = await OrganizationUnit.findById(req.params.id);

        if (!organizationUnit) {
            res.status(400).send({message: 'not found'});
            return;
        }

        const organizationUnitObject = organizationUnit.toObject();
        const _ids = findAllByKey(organizationUnitObject, '_id');

        if (!_ids || _ids.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }

        const allDeleted = [];

        for (const _id of _ids) {
            const unit = await OrganizationUnit.findById(_id, {}, {autopopulate: false}).select('-__v');
            if (unit) {
                const parent = await OrganizationUnit.findById(unit.parent, {}, {autopopulate: false});
                if (parent) {
                    parent.my_children = parent.my_children.filter((child) => {
                        return child.toString() !== unit._id.toString();
                    });
                    await parent.save();
                }

                unit.remove();
                allDeleted.push(unit);
            }
        }

        res.send(allDeleted);
    } catch (e) {
        res.status(500).send(e)
    }
}

module.exports = {
    addAnOrganizationUnit,
    readAnOrganizationUnit,
    readAllOrganizationUnits,
    readAPopulateOrganizationUnit,
    updateAnOrganizationUnit,
    deleteAnOrganizationUnit
}