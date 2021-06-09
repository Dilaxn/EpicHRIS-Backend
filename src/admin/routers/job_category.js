const express = require('express');

const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addAJobCategory, readAJobCategory, readAllJobCategories, updateAJobCategory, deleteJobCategories} = require('../controllers/job_category');

const router = new express.Router();

router.post('/api/job_categories', isAdmin, addAJobCategory);
router.get('/api/job_categories/:job_category_id', auth, readAJobCategory);
router.get('/api/job_categories', auth, readAllJobCategories);
router.patch('/api/job_categories/:job_category_id', isAdmin, updateAJobCategory);
router.delete('/api/job_categories', isAdmin, deleteJobCategories);


module.exports = router;