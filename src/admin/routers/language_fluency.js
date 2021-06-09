const express = require('express');
const auth = require('../../../middleware/auth');

const {readAllLanguageFluency} = require('../controllers/language_fluency');

const router = new express.Router();

router.get('/api/language_fluency', auth, readAllLanguageFluency);
module.exports = router;