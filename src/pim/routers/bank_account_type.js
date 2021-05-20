const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addAnBankAccountType, getAllBankAccountType, deleteBankAccountTypes} = require('../controllers/bank_account_type');

const router = new express.Router();

router.post('/bank_account_types', isAdmin, addAnBankAccountType);
router.get('/bank_account_types', auth, getAllBankAccountType);
router.delete('/bank_account_types', isAdmin, deleteBankAccountTypes);

module.exports = router;