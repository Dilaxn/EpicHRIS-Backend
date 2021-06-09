const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');
const LeaveTypeService = require('./LeaveTypeService');
const leaveTypeService = new LeaveTypeService();
const router = new express.Router();
router.post('/api/leaveTypes', isAdmin, async (req, res) => {
    try {
        const added = await leaveTypeService.addALeaveType(req.body);
        res.status(201).send({success: true, added});
    }catch (e) {
        res.status(500).send({success: false, err: e.message})
    }
});
router.get('/api/leaveTypes', auth, async (req, res) => {
    try {
        const found = await leaveTypeService.readAllLeaveTypes();
        if (!found.success) {
            res.status(404).send(found);
            return;
        }
        res.status(200).send(found);
    }catch (e) {
        res.status(500).send({success: false, err: e.message})
    }
})
router.patch('/api/leaveTypes/:id', isAdmin, async (req, res) => {
    try {
        const updated = await leaveTypeService.updateALeaveType(req.params.id, req.body);
        if (!updated.success) {
            const statusCode = updated.message === 'leave type not found' ? 404 : 400;
            res.status(statusCode).send(updated);
        }
        res.status(200).send(updated);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});
router.delete('/api/leaveTypes', isAdmin, async (req, res) => {
    try {
        const deleted = await leaveTypeService.deleteLeaveTypes(req.body);
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