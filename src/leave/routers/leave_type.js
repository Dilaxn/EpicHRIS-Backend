const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');
const {addALeaveType, readAllLeaveTypes, updateALeaveType, deleteLeaveTypes} = require('../controllers/leave_type');
const router = new express.Router();

router.post('/leave/configure/leave_types', isAdmin, addALeaveType);
router.get('/leave/configure/leave_types', auth, readAllLeaveTypes);
router.patch('/leave/configure/leave_types/:id', isAdmin, updateALeaveType);
router.delete('/leave/configure/leave_types', isAdmin, deleteLeaveTypes);

module.exports = router;