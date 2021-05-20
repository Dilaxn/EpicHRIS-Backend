const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addAMembership, readAMembership, readAllMemberships, updateAMembership, deleteMemberships} = require('../controllers/membership');

const router = new express.Router();


router.post('/memberships', isAdmin, addAMembership);
router.get('/memberships/:id', auth, readAMembership);
router.get('/memberships', auth, readAllMemberships);
router.patch('/memberships/:id', isAdmin, updateAMembership);
router.delete('/memberships', isAdmin, deleteMemberships);
module.exports = router;