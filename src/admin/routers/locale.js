const express = require('express');
const auth = require('../../../middleware/auth');
const {readAllLocales} = require('../controllers/locale');
const router = new express.Router();

router.get('/api/locales', auth, readAllLocales);

module.exports = router;