const {Country} = require('../models/country');

const findOneCountry = async (req, res) => {
    try {
        const country = await Country.findOne({name: req.query.name});
        if (!country) {
            res.status(404).send({message: 'country not found'});
            return;
        }

        res.send(country);
    }catch (e) {
        res.status(500).send(e);
    }
}

const readAllCountries = async (req, res) => {
    try {
        const countries = await Country.find({}).select('-__v');
        if (!countries) {
            res.status(404).send({message: 'countries not found'});
            return;
        }

        res.send(countries);
    }catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
    findOneCountry,
    readAllCountries
}