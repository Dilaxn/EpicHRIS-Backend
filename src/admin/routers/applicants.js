const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addApplicant, readApplicant, readAllApplicants, deleteApplicants} = require('../controllers/applicants');
const router = new express.Router();


router.post('/applicant', addApplicant);
router.get('/applicant/:id', isAdmin, readApplicant);
router.get('/applicants',auth, readAllApplicants);
// router.patch('/skills/:id', isAdmin, updateASkill);
router.delete('/applicant', auth, deleteApplicants);
module.exports = router;