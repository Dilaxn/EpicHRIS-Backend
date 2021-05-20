const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addAPayGrade, getAPayGrade, getAllPayGrades, updateAPayGrade, deletePayGrades} = require('../controllers/pay_grade');

const router = new express.Router();


router.post('/pay_grades', isAdmin, addAPayGrade);
router.get('/pay_grades/:id', auth, getAPayGrade);
router.get('/pay_grades', auth, getAllPayGrades);
router.patch('/pay_grades/:id', isAdmin, updateAPayGrade);
router.delete('/pay_grades', isAdmin, deletePayGrades);


module.exports = router;