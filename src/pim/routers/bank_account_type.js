const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addAnBankAccountType, getAllBankAccountType, deleteBankAccountTypes} = require('../controllers/bank_account_type');

const router = new express.Router();

router.post('/api/bank_account_types', isAdmin, addAnBankAccountType);
router.get('/api/bank_account_types', auth, getAllBankAccountType);
router.delete('/api/bank_account_types', isAdmin, deleteBankAccountTypes);

module.exports = router;