const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addAnEducationLevel, readAEducationLevel, readAllEducationLevel, updateAnEducationLevel, deleteEducationLevels} = require('../controllers/education_level');

const router = new express.Router();


router.post('/education_levels', isAdmin, addAnEducationLevel);
router.get('/education_levels/:id', auth, readAEducationLevel);
router.get('/education_levels', auth, readAllEducationLevel);
router.patch('/education_levels/:id', isAdmin, updateAnEducationLevel);
router.delete('/education_levels', isAdmin, deleteEducationLevels);

module.exports = router;