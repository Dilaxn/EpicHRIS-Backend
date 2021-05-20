const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');
const {addANationality, readAllNationalities, deleteNationalities} = require('../controllers/nationalities');
const router = new express.Router();

router.post('/nationalities', isAdmin, addANationality);
router.get('/nationalities', auth, readAllNationalities);
router.delete('/nationalities', isAdmin, deleteNationalities);
module.exports = router;