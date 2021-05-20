const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addASkill, readASkill, readAllSkills, updateASkill, deleteSkills} = require('../controllers/skill');
const router = new express.Router();


router.post('/skills', isAdmin, addASkill);
router.get('/skills/:id', auth, readASkill);
router.get('/skills', auth, readAllSkills);
router.patch('/skills/:id', isAdmin, updateASkill);
router.delete('/skills', isAdmin, deleteSkills);
module.exports = router;