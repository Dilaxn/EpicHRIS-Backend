const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');
const {addACustomField, getACustomField, getAllCustomFields, updateACustomField,
    deleteCustomFields, getAllCustomFieldsOfAScreen} = require('../controllers/custom_field');

const router = new express.Router();

router.post('/custom_fields', isAdmin, addACustomField);
router.get('/custom_fields/:id',  auth, getACustomField);
router.get('/custom_fields',  auth, getAllCustomFields);
router.get('/custom_fields/:screen/all', auth, getAllCustomFieldsOfAScreen);
router.patch('/custom_fields/:id', isAdmin, updateACustomField);
router.delete('/custom_fields', isAdmin, deleteCustomFields);

module.exports = router