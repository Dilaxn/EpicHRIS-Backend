const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addApplicant, readApplicant, readAllApplicants, deleteApplicants} = require('../controllers/applicants');
const router = new express.Router();


router.post('/api/applicant', addApplicant);
router.get('/api/applicant/:id', isAdmin, readApplicant);
router.get('/api/applicants',auth, readAllApplicants);
// router.patch('/api/skills/:id', isAdmin, updateASkill);
router.delete('/api/applicant', auth, deleteApplicants);
module.exports = router;