const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');
const {addATerminationReason, readATerminationReason, readAllTerminationReason, updateATerminationReason, deleteMultipleTerminationReasons} = require('../controllers/termination_reason.js');

const router = new express.Router();


router.post('/termination_reasons', isAdmin, addATerminationReason);
router.get('/termination_reasons/:id', auth, readATerminationReason);
router.get('/termination_reasons', auth, readAllTerminationReason);
router.patch('/termination_reasons/:id', isAdmin, updateATerminationReason);
router.delete('/termination_reasons', isAdmin, deleteMultipleTerminationReasons);

module.exports = router;