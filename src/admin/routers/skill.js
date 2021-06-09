const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addASkill, readASkill, readAllSkills, updateASkill, deleteSkills} = require('../controllers/skill');
const router = new express.Router();


router.post('/api/skills', isAdmin, addASkill);
router.get('/api/skills/:id', auth, readASkill);
router.get('/api/skills', auth, readAllSkills);
router.patch('/api/skills/:id', isAdmin, updateASkill);
router.delete('/api/skills', isAdmin, deleteSkills);
module.exports = router;