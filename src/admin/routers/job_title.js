const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');
const error = require('../../../middleware/error');

const {addAJobTitle, readAJobTitle, readJobSpecification, readAllJobTitles, updateAJobTitle, deleteMultipleJobTiles} = require('../controllers/job_title');
const {pdfUpload} = require('../../../middleware/file_upload');

const router = new express.Router();


router.post('/job_titles', isAdmin, pdfUpload.single('job_specification'), addAJobTitle, error);
router.get('/job_titles/:job_title_id', auth, readAJobTitle);
router.get('/job_titles/:job_title_id/job_specification', readJobSpecification);
router.get('/job_titles', auth, readAllJobTitles);
router.patch('/job_titles/:job_title_id', isAdmin, pdfUpload.single('job_specification'), updateAJobTitle, error);
router.delete('/job_titles', isAdmin, deleteMultipleJobTiles)


module.exports = router;