const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');
const {addANationality, readAllNationalities, deleteNationalities} = require('../controllers/nationalities');
const router = new express.Router();

router.post('/api/api/nationalities', isAdmin, addANationality);
router.get('/api/api/nationalities', auth, readAllNationalities);
router.delete('/api/api/nationalities', isAdmin, deleteNationalities);
module.exports = router;