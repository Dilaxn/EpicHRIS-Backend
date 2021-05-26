const express = require('express');
const isAdmin = require('../../../middleware/admin');
const supervisorOrAdmin = require('../../../middleware/supervisor_or_admin');
const auth = require('../../../middleware/auth');
const LeaveEntitlementService = require('./LeaveEntitlementService');
const leaveEntitlementService = new LeaveEntitlementService();
const router = new express.Router();
router.post('/entitlements', isAdmin, async (req, res) => {
    try {
        if (!req.body.employees) {
            res.status(400).send({success: false, message: 'employees property not found in the body'});
            return;
        }
        const entitlement = {
            ...req.body
        };
        delete entitlement.employees;
        const result = await leaveEntitlementService.addEntitlements(req.body.employees, entitlement);
        if (!result.success) {
            res.status(400).send({result});
            return;
        }
        return res.status(201).send(result);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});
router.get('/employees/me/entitlements', auth, async (req, res) => {
    try {
        const entitlements = await leaveEntitlementService.queryEntitlement(req.user.employee, req.query);
        if (!entitlements.success) {
            res.status(404).send(entitlements);
            return;
        }
        res.status(200).send(entitlements);
    }catch (e) {
        res.status(500).send({success: true, err: e.message});
    }
})
router.get('/employees/:emp_id/entitlements', supervisorOrAdmin, async (req, res) => {
    try {
        const entitlements = await leaveEntitlementService.queryEntitlement(req.params.emp_id, req.query);
        if (!entitlements.success) {
            res.status(404).send(entitlements);
            return;
        }
        res.status(200).send(entitlements);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
})
router.patch('/entitlements/:id', isAdmin, async (req, res) => {
    try {
        const updated = await leaveEntitlementService.updateEntitlement(req.params.id, req.body);
        if (!updated.success) {
            const errCode = updated.message === 'entitlement not found' ? 404 : 400;
            res.status(errCode).send(updated);
            return;
        }
        res.status(200).send(updated)
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
})
router.delete('/entitlements', isAdmin, async (req, res) => {
    try {
        const deleted = await leaveEntitlementService.deleteEntitlements(req.body);
        if (!deleted.success) {
            const statusCode = deleted.message === 'entitlement not found' ? 404 : 400;
            res.status(statusCode).send(deleted);
            return;
        }
        res.status(200).send(deleted);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
})
module.exports = router;