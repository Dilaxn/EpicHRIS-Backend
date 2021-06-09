const express = require('express');

const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addAnEmploymentStatus, readAnEmploymentStatus, readAllEmploymentStatus, updateAnEmployment_Status, deleteEmploymentStatuses} = require('../controllers/employment_status');

const router = new express.Router();

router.post('/api/employment_status', isAdmin, addAnEmploymentStatus);
router.get('/api/employment_status/:employment_status_id', auth, readAnEmploymentStatus);
router.get('/api/employment_status', auth, readAllEmploymentStatus);
router.patch('/api/employment_status/:employment_status_id', isAdmin, updateAnEmployment_Status);
router.delete('/api/employment_status', isAdmin, deleteEmploymentStatuses);


module.exports = router;