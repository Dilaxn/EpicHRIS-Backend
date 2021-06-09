const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addALocation, readALocation, queryLocations, updateALocation, deleteMultipleLocation} = require('../controllers/organizationLocation');

const router = new express.Router();


router.post('/api/location', isAdmin, addALocation);
router.get('/api/locations', auth, queryLocations);
router.get('/api/location/:id', auth, readALocation);
router.patch('/api/location/:id', isAdmin, updateALocation);
router.delete('/api/location', isAdmin, deleteMultipleLocation);


module.exports = router;