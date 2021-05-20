const express = require('express');
const isAdmin = require('../../../middleware/admin');

const {defineAReport, readAllDefinedReports, updateADefinedReport, deleteDefinedReports,
    runAReport} = require('../controllers/employee_report');

const router = new express.Router();

router.post('/employee_reports', isAdmin, defineAReport);
router.get('/employee_reports', isAdmin, readAllDefinedReports);
router.patch('/employee_reports/:id', isAdmin, updateADefinedReport);
router.delete('/employee_reports', isAdmin, deleteDefinedReports);
router.get('/employee_reports/:id', isAdmin, runAReport);

module.exports = router;