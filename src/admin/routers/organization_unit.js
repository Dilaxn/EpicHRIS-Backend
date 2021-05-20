const express = require('express');

const auth = require('../../../middleware/auth');
const isAdmin = require('../../../middleware/admin');

const { addAnOrganizationUnit, readAnOrganizationUnit, readAllOrganizationUnits, readAPopulateOrganizationUnit,
    updateAnOrganizationUnit, deleteAnOrganizationUnit, test} = require('../controllers/organization_unit');

const router = new express.Router();

router.post('/organization_units', isAdmin, addAnOrganizationUnit);
router.get('/organization_units/:id', auth, readAnOrganizationUnit);
router.get('/organization_units', auth, readAllOrganizationUnits);
router.get('/organization_units/:id/populate', auth, readAPopulateOrganizationUnit);
router.patch('/organization_units/:id', isAdmin, updateAnOrganizationUnit);
router.delete('/organization_units/:id', isAdmin, deleteAnOrganizationUnit);

module.exports = router;