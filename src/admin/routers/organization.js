const express = require('express');
const isAdmin = require('../../../middleware/admin');
const {updateOrganizationGeneralInformation} = require('../controllers/organization');
const router = new express.Router();

router.patch('/organization/general/info', isAdmin, updateOrganizationGeneralInformation);
module.exports = router;