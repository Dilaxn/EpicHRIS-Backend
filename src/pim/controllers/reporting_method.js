const {ReportingMethod} = require('../models/reporting_method');

const readAllReportingMethod = async (req, res) => {
    try {
        const reportingMethods = await ReportingMethod.find({}).select('name');
        if (!reportingMethods || reportingMethods.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(reportingMethods);
    }catch (e) {
        res.status(500).send({message: 'internal error'});
    }
}

const AddAReportingMethod = async (req, res) => {
    try {
        const reportingMethod = new ReportingMethod({
            ...req.body
        });

        if (!reportingMethod) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await reportingMethod.save();
        const final = reportingMethod.toObject();
        delete final.__v;
        res.status(201).send(final);
    }catch (e) {
        res.status(500).send({message: 'An internal Error'});
    }
}

const deleteReportingMethods = async (req, res) => {
    try {
        const ids = req.body.reporting_methods;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const final = [];
        for (const id of ids) {
            const deleted = await ReportingMethod.findById(id);
            if (deleted) {
                deleted.remove();
                const obj = deleted.toObject();
                delete obj.__v;
                final.push(obj);
            }
        }

        if (final.length === 0) {
            res.status(404).send({message: 'could not delete any document'});
            return;
        }

        res.send(final);
    }catch (e) {
        res.status(500).send({message: 'an internal error'});
    }
}

module.exports = {
    readAllReportingMethod,
    AddAReportingMethod,
    deleteReportingMethods
}