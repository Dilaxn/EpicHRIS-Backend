const express = require('express');
const HolidayService = require('./HolidayService');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');
const holidayService = new HolidayService();
const router = new express.Router();
router.post('/api/holidays', isAdmin, async (req, res) => {
    try {
        const added = await holidayService.addAHoliday(req.body);
        if (!added) {
            res.status(400).send(added);
            return;
        }
        res.status(201).send({success: true, added});
    }catch (e) {
        res.status(400).send({success: false, err: e.message});
    }
});
router.get('/api/holidays', auth, async (req, res) => {
    try {
        const holidays = await holidayService.queryHoliday(req.body);
        res.status(200).send({success: true, holidays})
    }catch (e) {
        const errCode = e.message === 'holiday not found' ? 404 : 400;
        res.status(errCode).send({success: false, err: e.message});
    }
});
router.patch('/api/holidays/:id', isAdmin, async (req, res) => {
    try {
        const updated = await holidayService.updateAHoliday(req.params.id, req.body);
        res.status(200).send({success: false, updated});
    }catch (e) {
        const errCode = e.message === 'holiday not found' ? 404 : 400;
        res.status(errCode).send({success: false, err: e.message});
    }
})
router.delete('/api/holidays', isAdmin, async (req, res) => {
    try {
        const deleted = await holidayService.deleteHolidays(req.body);
        res.status(200).send({success: true, deleted});
    }catch (e) {
        res.status(400).send({success: false, err: e.message});
    }
})
module.exports = router;