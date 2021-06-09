const express = require('express');
const isAdmin = require('../../../middleware/admin');

const {updatePimConfiguration} = require('../controllers/pim_configuration');

const router = new express.Router();

router.patch('/api/pim_configuration', isAdmin, updatePimConfiguration);
module.exports = router;
