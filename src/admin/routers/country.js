const express = require('express');
const auth = require('../../../middleware/auth');

const {readAllCountries, findOneCountry} = require('../controllers/country');

const router = new express.Router();


router.get('/countries/all', auth, readAllCountries);
router.get('/countries', auth, findOneCountry);


module.exports = router;