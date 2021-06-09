const express = require('express');
const auth = require('../../../middleware/auth');

const {readAllLanguages} = require('../controllers/language');

const router = new express.Router();

router.get('/api/languages', auth, readAllLanguages);

module.exports = router;