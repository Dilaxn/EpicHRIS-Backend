const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');
const ProjectService = require('./ProjectService');
const projectService = new ProjectService();
const router = new express.Router();
router.post('/projects', isAdmin, async (req, res) => {
    try {
        const added = await projectService.addProject(req.body);
        res.status(201).send(added);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});
router.get('/projects', auth, async (req, res) => {
    try {
        const found = await projectService.queryProject(req.query);
        if (!found.success) {
            res.status(404).send(found);
            return;
        }
        res.status(200).send(found);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
})
router.patch('/projects/:id', isAdmin, async (req, res) => {
    try {
        const updated = await projectService.updateAProject(req.params.id, req.body);
        if (!updated.success) {
            res.status(404).send(updated);
            return;
        }
        res.status(200).send(updated);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});
router.delete('/projects', isAdmin, async (req, res) => {
    try {
        const deleted = await projectService.deleteProjects(req.body.id);
        if (!deleted.success) {
            const statusCode = 400;
            res.status(statusCode).send(deleted);
            return;
        }
        res.status(200).send(deleted);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
})
module.exports = router;