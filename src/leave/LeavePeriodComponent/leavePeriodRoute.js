const express = require('express');
const isAuth = require('../../../middleware/auth');
const LeavePeriodService = require('./LeavePeriodService');
const leavePeriodService = new LeavePeriodService();
const router = new express.Router();
router.get('/leavePeriods', isAuth, async (req, res) => {
    try {
        const result = await leavePeriodService.getAllLeavePeriods();
        if (!result.success) {
            res.status(404).send(result);
            return;
        }
        res.send(result);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});
module.exports = router;