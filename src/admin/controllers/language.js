const {Language} = require('../models/language');

const readAllLanguages = async (req, res) => {
    try {
        const languages = await Language.find({}).select('-__v');

        if (!languages || languages.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(languages);
    }catch (e) {
        res.status(500).send(e);
    }
}


module.exports = {
    readAllLanguages
}