const express = require('express');

const auth = require('../../../middleware/auth');
const isAdmin = require('../../../middleware/admin');

const {readAllReportingMethod, AddAReportingMethod, deleteReportingMethods} = require('../controllers/reporting_method');

const router = new express.Router();

router.get('/reporting_methods', auth, readAllReportingMethod);
router.post('/reporting_methods', isAdmin, AddAReportingMethod);
router.delete('/reporting_methods', isAdmin, deleteReportingMethods);
module.exports = router;