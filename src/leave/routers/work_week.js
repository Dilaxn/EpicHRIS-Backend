const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {updateWorkWeekConfiguration, readWorkWeekConfiguration} = require('../controllers/work_week');

const router = new express.Router();

router.patch('/leave/configure/work_week', isAdmin, updateWorkWeekConfiguration);
router.get('/leave/configure/work_week', auth, readWorkWeekConfiguration);
module.exports = router;