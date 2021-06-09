const express = require('express');
const isAdmin = require('../../../middleware/admin');
const WorkWeekService = require('./WorkWeekService');
const workWeekService = new WorkWeekService();
const router = new express.Router();
router.patch('/api/workWeek', isAdmin, async (req, res) => {
    try {
        const updated = await workWeekService.updateWorkWeek(req.body);
        res.status(200).send({success: true, updated});
    }catch (e) {
        res.status(400).send({success: false, err: e.message});
    }
})
module.exports = router;