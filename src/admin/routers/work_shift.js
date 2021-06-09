const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');
const supervisorOrAdmin = require('../../../middleware/supervisor_or_admin');
const {addAWorkShift, readAllWorkShifts, readMyWorkShift, readAWorkShiftOfAnEmployee, readAWorkShift,
    readAllEmployeesNotAssignedToWorkShift, updateAWorkShift, deleteWorkShifts} = require('../controllers/work_shift');
const router = new express.Router();

router.post('/api/work_shifts', isAdmin, addAWorkShift);
router.get('/api/work_shifts', isAdmin, readAllWorkShifts);
router.get('/api/employees/work_shifts/me', auth, readMyWorkShift);
router.get('/api/employees/work_shifts/none', isAdmin, readAllEmployeesNotAssignedToWorkShift);
router.get('/api/employees/work_shifts/:emp_id', supervisorOrAdmin, readAWorkShiftOfAnEmployee);
router.get('/api/work_shifts/:id', isAdmin, readAWorkShift);
router.patch('/api/work_shifts/:id', isAdmin, updateAWorkShift);
router.delete('/api/work_shifts', isAdmin, deleteWorkShifts);


module.exports = router;