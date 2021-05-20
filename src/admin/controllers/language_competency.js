const {LanguageCompetency} = require('../models/language_competency');

const readAllLanguageCompetencies = async (req, res) => {
    try {
        const language_competency = await LanguageCompetency.find({}).select('name');

        if (!language_competency || language_competency.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(language_competency);
    }catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
    readAllLanguageCompetencies
}