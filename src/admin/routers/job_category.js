const express = require('express');

const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addAJobCategory, readAJobCategory, readAllJobCategories, updateAJobCategory, deleteJobCategories} = require('../controllers/job_category');

const router = new express.Router();

router.post('/job_categories', isAdmin, addAJobCategory);
router.get('/job_categories/:job_category_id', auth, readAJobCategory);
router.get('/job_categories', auth, readAllJobCategories);
router.patch('/job_categories/:job_category_id', isAdmin, updateAJobCategory);
router.delete('/job_categories', isAdmin, deleteJobCategories);


module.exports = router;