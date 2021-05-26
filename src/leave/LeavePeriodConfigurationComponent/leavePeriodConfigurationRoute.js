const express = require('express');
const isAdmin = require('../../../middleware/admin');
const LeavePeriodConfigurationService = require('./LeavePeriodConfigurationService');
const leavePeriodConfigurationService = new LeavePeriodConfigurationService();
const router = new express.Router();
router.patch('/leavePeriod/configure', isAdmin, async (req, res) => {
    try {
        const result = await leavePeriodConfigurationService.updateLeavePeriodConfiguration(req.body);
        if (!result.success) {
            res.status(400).send(result);
            return;
        }
        res.status(200).send(result)
    }catch (e) {
        res.status(500).send({success: false, error: e.message});
    }
})
router.get('/leavePeriod/configure', isAdmin, async (req, res) => {
    try {
        const leavePeriodConfig = await leavePeriodConfigurationService.getLeavePeriodConfiguration();
        if (!leavePeriodConfig) {
            res.status(404).send({success: false, message: 'Configuration not found'});
            return;
        }
        res.status(200).send({success: true, leavePeriodConfig});
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
})
module.exports = router;