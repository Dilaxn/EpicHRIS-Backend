const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {assignCurrencyForAPayGrade, readACurrencyForAPayGrade, readAllCurrenciesForAPayGrade,
    updateACurrencyOfAPayGrade, deletePayGradeCurrenciesOfAPayGrade } = require('../controllers/pay_grade_currency');

const router = new express.Router();

router.post('/pay_grades/:id/pay_grade_currencies', isAdmin, assignCurrencyForAPayGrade);
router.get('/pay_grades/:id/pay_grade_currencies/:currency_id', auth, readACurrencyForAPayGrade);
router.get('/pay_grades/:id/pay_grade_currencies', auth, readAllCurrenciesForAPayGrade);
router.patch('/pay_grades/:id/pay_grade_currencies/:currency_id', isAdmin, updateACurrencyOfAPayGrade);
router.delete('/pay_grades/:id/pay_grade_currencies', isAdmin, deletePayGradeCurrenciesOfAPayGrade);

module.exports = router;