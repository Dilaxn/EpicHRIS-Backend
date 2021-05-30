const express = require('express');
const auth = require('../../../middleware/auth');
const admin = require('../../../middleware/admin');
const supervisorOrAdmin = require('../../../middleware/supervisor_or_admin');
const LeaveService = require('./LeaveService');
const leaveService = new LeaveService();
const router = new express.Router();
router.post('/leave/apply', auth, async (req, res) => {
    try {
        const leaveApplied = await leaveService.applyLeave(req.user.employee, req.body);
        if (!leaveApplied.success) {
            res.status(400).send(leaveApplied);
            return;
        }
        res.status(201).send(leaveApplied);
    } catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});
router.get('/leaves/all', admin, async (req, res) => {
    try {
        const leaves = await leaveService.queryAllLeaveDays(req.query);
        if (!leaves.success) {
            const statusCode = 404;
            res.status(statusCode).send(leaves);
            return
        }
        res.status(200).send(leaves)
    } catch (e) {
        res.status(500).send({
            success: false,
            err: e.message
        })
    }
});
router.get('/leaves/subordinates', auth, async (req, res) => {
    try {
        const leaves = await leaveService.querySubOrdinateLeave(req.user.employee, req.query);
        if (!leaves.success) {
            res.status(404).send(leaves);
            return;
        }
        res.status(200).send(leaves)
    } catch (e) {
        res.status(500).send({
            success: false,
            err: e.message
        })
    }
});
router.get('/leaves/mine', auth, async (req, res) => {
    try {
        const leaves = await leaveService.queryMyLeaves(req.user.employee, req.query);
        if (!leaves.success) {
            res.status(404).send(leaves);
            return;
        }
        res.status(200).send(leaves);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
})
router.patch('/employees/:emp_id/leaves', supervisorOrAdmin, async (req, res) => {
    try {
        const updated = await leaveService.updateLeaveDay(req.user.employee, req.params.emp_id, req.body);
        if (!updated.success) {
            res.status(400).send(updated);
            return
        }
        res.status(200).send(updated);
    }catch (e) {
        res.status(500).send({
            success: false,
            err: e.message
        })
    }
})
router.patch('/leaves/mine/cancel', auth, async (req, res) => {
    try {
        const cancelled = await leaveService.cancelMyLeaveRequest(req.user.employee, req.body);
        if (!cancelled.success) {
            res.status(400).send(cancelled);
            return
        }
        res.status(200).send(cancelled);
    }catch (e) {
        res.status(500).send({
            success: false,
            err: e.message
        })
    }
});
router.patch('/leaves/trigger/taken', admin, async (req, res) => {
    try {
        await leaveService.updateLeaveTaken();
        res.status(201).send({success: true, message: 'success'});
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
})
module.exports = router;