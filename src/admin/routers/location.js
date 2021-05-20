const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addALocation, readALocation, queryLocations, updateALocation, deleteMultipleLocation} = require('../controllers/organizationLocation');

const router = new express.Router();


router.post('/location', isAdmin, addALocation);
router.get('/locations', auth, queryLocations);
router.get('/location/:id', auth, readALocation);
router.patch('/location/:id', isAdmin, updateALocation);
router.delete('/location', isAdmin, deleteMultipleLocation);


module.exports = router;