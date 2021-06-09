const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addAMembership, readAMembership, readAllMemberships, updateAMembership, deleteMemberships} = require('../controllers/membership');

const router = new express.Router();


router.post('/api/memberships', isAdmin, addAMembership);
router.get('/api/memberships/:id', auth, readAMembership);
router.get('/api/memberships', auth, readAllMemberships);
router.patch('/api/memberships/:id', isAdmin, updateAMembership);
router.delete('/api/memberships', isAdmin, deleteMemberships);
module.exports = router;