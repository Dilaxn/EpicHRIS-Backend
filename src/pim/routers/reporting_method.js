const express = require('express');

const auth = require('../../../middleware/auth');
const isAdmin = require('../../../middleware/admin');

const {readAllReportingMethod, AddAReportingMethod, deleteReportingMethods} = require('../controllers/reporting_method');

const router = new express.Router();

router.get('/api/reporting_methods', auth, readAllReportingMethod);
router.post('/api/reporting_methods', isAdmin, AddAReportingMethod);
router.delete('/api/reporting_methods', isAdmin, deleteReportingMethods);
module.exports = router;