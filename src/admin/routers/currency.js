const express = require('express');
const auth = require('../../../middleware/auth');
const {readAllCurrencies} = require('../controllers/currency');

const router = new express.Router();


router.get('/api/currencies', auth, readAllCurrencies)

module.exports = router;