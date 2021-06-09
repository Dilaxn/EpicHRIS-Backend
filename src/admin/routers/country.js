const express = require('express');
const auth = require('../../../middleware/auth');

const {readAllCountries, findOneCountry} = require('../controllers/country');

const router = new express.Router();


router.get('/api/countries/all', auth, readAllCountries);
router.get('/api/countries', auth, findOneCountry);


module.exports = router;