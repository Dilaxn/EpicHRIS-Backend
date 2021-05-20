const {Holiday} = require('../models/holiday');

const addAHoliday = async (req, res) => {
    try {
        const holiday = new Holiday({
            ...req.body
        });
        if (!holiday) {
            res.status(400).send({message: 'invalid request sent'});
            return;
        }
        await holiday.save();
        const final = holiday.toObject();
        delete final.id;
        delete final.__v;

        res.status(201).send(final);
    } catch (e) {
        res.status(500).send({message: e.message});
    }
}

const readHolidays = async (req, res) => {
    try {
        const holidays = await Holiday.find({
            holiday_date: {
                $gte: req.query.start_date,
                $lte: req.query.end_date
            }
        }).select('-__v');
        if (!holidays || holidays.length === 0) {
            res.status(404).send({message: 'could not found'});
            return;
        }
        const final = JSON.parse(JSON.stringify(holidays));
        final.forEach((holiday) => {
            delete holiday.id;
        })
        res.status(200).send(final);
    } catch (e) {
        res.status(500).send({message: e.message});
    }
}
const updateAHoliday = async (req, res) => {
    try {
        const holiday = await Holiday.findByIdAndUpdate(req.params.id, {...req.body}, {new: true})
            .select('-__v');
        if (!holiday) {
            res.status(400).send({message: 'unable to update, something went wrong'});
            return;
        }
        const final = holiday.toObject();
        delete final.id;
        res.status(200).send(final);
    }catch (e) {
        res.status(500).send({message: e.message});
    }
}

const deleteHolidays = async (req, res) => {
    try {
        const idsToBeDeleted = req.body.holidays;
        if (!idsToBeDeleted || !Array.isArray(idsToBeDeleted) || idsToBeDeleted.length === 0) {
            res.status(400).send({message: 'invalid request!'});
            return;
        }

        const deletedHolidays = [];
        for(const id of idsToBeDeleted) {
            const holiday = await Holiday.findById(id).select('-__v');
            if (holiday) {
                holiday.remove();
                const deleted = holiday.toObject();
                delete deleted.id;
                deletedHolidays.push(deleted);
            }
        }

        if (deletedHolidays.length === 0) {
            res.status(404).send({message: 'No holidays deleted'});
            return;
        }
        res.status(200).send(deletedHolidays);
    }catch (e) {
        res.status(500).send({message: e.message});
    }
}

module.exports = {
    addAHoliday,
    readHolidays,
    updateAHoliday,
    deleteHolidays
}