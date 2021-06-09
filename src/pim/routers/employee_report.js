const express = require('express');
const isAdmin = require('../../../middleware/admin');

const {defineAReport, readAllDefinedReports, updateADefinedReport, deleteDefinedReports,
    runAReport} = require('../controllers/employee_report');

const router = new express.Router();

router.post('/api/employee_reports', isAdmin, defineAReport);
router.get('/api/employee_reports', isAdmin, readAllDefinedReports);
router.patch('/api/employee_reports/:id', isAdmin, updateADefinedReport);
router.delete('/api/employee_reports', isAdmin, deleteDefinedReports);
router.get('/api/employee_reports/:id', isAdmin, runAReport);

module.exports = router;