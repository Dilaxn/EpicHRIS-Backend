const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addALicenseType, readALicenseType, readAllLicenseTypes, updateALicenseType, deleteLicenseTypes} = require('../controllers/license');


const router = new express.Router();

router.post('/licenses', isAdmin, addALicenseType);
router.get('/licenses/:id', auth, readALicenseType);
router.get('/licenses', auth, readAllLicenseTypes);
router.patch('/licenses/:id', isAdmin, updateALicenseType);
router.delete('/licenses', isAdmin, deleteLicenseTypes);

module.exports = router;