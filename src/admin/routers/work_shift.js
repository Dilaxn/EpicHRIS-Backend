const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');
const supervisorOrAdmin = require('../../../middleware/supervisor_or_admin');
const {addAWorkShift, readAllWorkShifts, readMyWorkShift, readAWorkShiftOfAnEmployee, readAWorkShift,
    readAllEmployeesNotAssignedToWorkShift, updateAWorkShift, deleteWorkShifts} = require('../controllers/work_shift');
const router = new express.Router();

router.post('/work_shifts', isAdmin, addAWorkShift);
router.get('/work_shifts', isAdmin, readAllWorkShifts);
router.get('/employees/work_shifts/me', auth, readMyWorkShift);
router.get('/employees/work_shifts/none', isAdmin, readAllEmployeesNotAssignedToWorkShift);
router.get('/employees/work_shifts/:emp_id', supervisorOrAdmin, readAWorkShiftOfAnEmployee);
router.get('/work_shifts/:id', isAdmin, readAWorkShift);
router.patch('/work_shifts/:id', isAdmin, updateAWorkShift);
router.delete('/work_shifts', isAdmin, deleteWorkShifts);


module.exports = router;