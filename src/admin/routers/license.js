const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addALicenseType, readALicenseType, readAllLicenseTypes, updateALicenseType, deleteLicenseTypes} = require('../controllers/license');


const router = new express.Router();

router.post('/api/licenses', isAdmin, addALicenseType);
router.get('/api/licenses/:id', auth, readALicenseType);
router.get('/api/licenses', auth, readAllLicenseTypes);
router.patch('/api/licenses/:id', isAdmin, updateALicenseType);
router.delete('/api/licenses', isAdmin, deleteLicenseTypes);

module.exports = router;