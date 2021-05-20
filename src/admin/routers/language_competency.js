const express = require('express');
const auth = require('../../../middleware/auth');

const {readAllLanguageCompetencies} = require('../controllers/language_competency');

const router = new express.Router();


router.get('/language_competencies', auth, readAllLanguageCompetencies);
module.exports = router;
