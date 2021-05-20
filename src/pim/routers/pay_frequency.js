const express = require('express');

const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addAPayFrequency, deletePayFrequencies, readAllPayFrequencies} = require('../controllers/pay_frequency');

const router = new express.Router();

router.post('/pay_frequencies', isAdmin, addAPayFrequency);
router.delete('/pay_frequencies', isAdmin, deletePayFrequencies);
router.get('/pay_frequencies', auth, readAllPayFrequencies);

module.exports = router;