const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addVacancy, readVacancy, readAllVacancies, deleteVacancies} = require('../controllers/vacancies');
const router = new express.Router();


router.post('/api/vacancies', isAdmin, addVacancy);
router.get('/api/vacancies/:id', isAdmin, readVacancy);
router.get('/api/vacancies', readAllVacancies);
// router.patch('/skills/:id', isAdmin, updateASkill);
router.delete('/api/vacancies', isAdmin, deleteVacancies);
module.exports = router;