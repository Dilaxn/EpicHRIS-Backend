const express = require('express');
const isAdmin = require('../../../middleware/admin');

const {updateEidConf} = require('../controllers/eid_configuration');

const router = new express.Router();

router.patch('/eid_configuration', isAdmin, updateEidConf);
module.exports = router;