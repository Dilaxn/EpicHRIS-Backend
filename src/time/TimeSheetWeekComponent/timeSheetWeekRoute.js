const express = require('express');
const auth = require('../../../middleware/auth');
const TimeSheetWeekService = require('./TimeSheetWeekService');
const timeSheetWeekService = new TimeSheetWeekService();
const router = new express.Router();
router.get('/timeSheetWeeks', auth, async (req, res) =>{
    try {
        const timeSheetWeeks = await timeSheetWeekService.getTimeSheet(req.query);
        if (!timeSheetWeeks.success) {
            res.status(404).send(timeSheetWeeks);
            return;
        }
        res.status(200).send(timeSheetWeeks);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
})
module.exports = router;