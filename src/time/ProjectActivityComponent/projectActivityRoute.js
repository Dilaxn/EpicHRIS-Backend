const express = require('express');
const auth = require('../../../middleware/auth');
const router = new express.Router();
const ProjectActivityService = require('./ProjectActivityService');
const projectActivityService = new ProjectActivityService();
router.post('/api/projects/:id/projectActivities', auth, async (req, res) => {
    try {
        const added = await projectActivityService.addProjectActivity(req.params.id, req.body, req.user);
        if (!added.success) {
            res.status(400).send(added);
            return;
        }
        res.status(201).send(added);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});
router.post('/api/projectActivities/copyFrom/:copyFrom/copyTo/:copyTo', auth, async (req, res) => {
    try {
        const result = await projectActivityService.copyProjectActivity(req.params.copyTo, req.params.copyFrom, req.user);
        if (!result.success) {
            res.status(400).send(result);
            return;
        }
        res.status(201).send(result);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});
router.get('/api/projects/:id/activities', auth, async (req, res) => {
    try {
        const found = await projectActivityService.getProjectActivities(req.params.id);
        if (!found.success) {
            res.status(404).send(found);
            return;
        }
        res.status(200).send(found);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
})
router.patch('/api/projects/:projectId/activities/:id', auth, async (req, res) => {
    try {
        const updated = await projectActivityService.updateProject(req.params.projectId, req.params.id, req.user, req.body.activityName);
        if (!updated.success) {
            res.status(400).send(updated);
            return;
        }
        res.status(200).send(updated);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
})
router.delete('/api/projects/:id/activities', auth, async (req, res) => {
    try {
        const deleted = await projectActivityService.deleteProjectActivities(req.params.id, req.user, req.body.id);
        if (!deleted.success) {
            res.status(400).send(deleted);
            return;
        }
        res.status(200).send(deleted);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
})
module.exports = router;