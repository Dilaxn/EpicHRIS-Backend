const {LanguageFluency} = require('../models/language_fluency');

const readAllLanguageFluency = async (req, res) => {
    try {
        const languageFluency = await LanguageFluency.find({}).select('name');

        if (!languageFluency || languageFluency.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(languageFluency);
    }catch (e) {
        res.status(500).send(e);
    }
}


module.exports = {
    readAllLanguageFluency
}