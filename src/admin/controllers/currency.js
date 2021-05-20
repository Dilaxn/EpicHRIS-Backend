const {Currency} = require('../models/currency');

const readAllCurrencies = async (req, res) => {
    try {
        const currencies = await Currency.find({}).select('code currency');
        if (!currencies || currencies.length === 0) {
            req.status(404).send({message: 'not found'});
            return;
        }

        res.send(currencies);
    }catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
    readAllCurrencies
}