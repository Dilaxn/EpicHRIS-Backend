const {Locale} = require('../models/locale');

const readAllLocales = async (req, res) => {
    try {
        const locales = await Locale.find({}).select('name local location');
        if (!locales || locales.length === 0) {
            res.status(404).send({message: 'locales not found'});
            return;
        }

        res.send(locales);
    }catch (e) {
        res.status(500).send({message: 'an internal error'});
    }
}


module.exports = {
    readAllLocales
}
