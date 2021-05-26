const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addVacancy, readVacancy, readAllVacancies, deleteVacancies} = require('../controllers/vacancies');
const router = new express.Router();


router.post('/vacancies', isAdmin, addVacancy);
router.get('/vacancies/:id', isAdmin, readVacancy);
router.get('/vacancies', readAllVacancies);
// router.patch('/skills/:id', isAdmin, updateASkill);
router.delete('/vacancies', isAdmin, deleteVacancies);
module.exports = router;