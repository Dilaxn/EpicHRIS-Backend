const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addAPayGrade, getAPayGrade, getAllPayGrades, updateAPayGrade, deletePayGrades} = require('../controllers/pay_grade');

const router = new express.Router();


router.post('/api/pay_grades', isAdmin, addAPayGrade);
router.get('/api/pay_grades/:id', auth, getAPayGrade);
router.get('/api/pay_grades', auth, getAllPayGrades);
router.patch('/api/pay_grades/:id', isAdmin, updateAPayGrade);
router.delete('/api/pay_grades', isAdmin, deletePayGrades);


module.exports = router;