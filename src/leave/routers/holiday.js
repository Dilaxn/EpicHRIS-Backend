const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');
const {addAHoliday, readHolidays, updateAHoliday, deleteHolidays} = require('../controllers/holiday');

const router = new express.Router();
router.post('/leave/configure/holidays', isAdmin, addAHoliday);
router.get('/leave/configure/holidays', auth, readHolidays);
router.patch('/leave/configure/holidays/:id', isAdmin, updateAHoliday);
router.delete('/leave/configure/holidays', isAdmin, deleteHolidays);

module.exports = router;