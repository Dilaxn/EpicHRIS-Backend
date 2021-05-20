const express = require('express');
const isAdmin = require('../../../middleware/admin');
const {updateLeavePeriodConf} = require('../controllers/leave_period');

const router = new express.Router();

router.patch('/leave/configure/leave_period', isAdmin, updateLeavePeriodConf);

module.exports = router;