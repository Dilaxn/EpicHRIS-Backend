const express = require('express');

const auth = require('../../../middleware/auth');
const isAdmin = require('../../../middleware/admin');

const { addAnOrganizationUnit, readAnOrganizationUnit, readAllOrganizationUnits, readAPopulateOrganizationUnit,
    updateAnOrganizationUnit, deleteAnOrganizationUnit, test} = require('../controllers/organization_unit');

const router = new express.Router();

router.post('/api/organization_units', isAdmin, addAnOrganizationUnit);
router.get('/api/organization_units/:id', auth, readAnOrganizationUnit);
router.get('/api/organization_units', auth, readAllOrganizationUnits);
router.get('/api/organization_units/:id/populate', auth, readAPopulateOrganizationUnit);
router.patch('/api/organization_units/:id', isAdmin, updateAnOrganizationUnit);
router.delete('/api/organization_units/:id', isAdmin, deleteAnOrganizationUnit);

module.exports = router;