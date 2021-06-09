const express = require('express');
const auth = require('../../../middleware/auth');
const supervisorOrAdmin = require('../../../middleware/supervisor_or_admin');
const AttendanceService = require('./AttendanceService');
const attendanceService = new AttendanceService();
const router = new express.Router();
//my route
router.get('/api/attendance/check', auth, async (req, res) => {
    try {
        const check = await attendanceService.isPunchedIn(req.user.employee);
        if (!check) {
            res.status(200).send(false);
            return;
        }
        res.status(200).send(check);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});


router.post('/api/attendance/punchIn', auth, async (req, res) => {
    try {
        const attendance = await attendanceService.punchIn(req.user.employee, req.body.note);
        if (!attendance.success) {
            res.status(400).send(attendance);
            return;
        }
        res.status(201).send(attendance);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});
router.patch('/api/attendance/punchOut', auth, async (req, res) => {
    try {
        const punchedOut = await attendanceService.punchOut(req.user.employee, req.body.note);
        if (!punchedOut.success) {
            res.status(400).send(punchedOut);
            return;
        }
        res.status(200).send(punchedOut);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});
router.post('/api/employee/:emp_id/attendance', supervisorOrAdmin, async (req, res) => {
    try {
        const added = await attendanceService.addAnAttendance(req.params.emp_id, req.body, req.user.employee);
        if (!added.success) {
            res.status(400).send(added);
            return;
        }
        res.status(201).send(added);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});
router.patch('/api/employee/:emp_id/attendance/:id', supervisorOrAdmin, async (req, res) => {
    try {
        const updated = await attendanceService.updateAttendance(req.params.emp_id, req.params.id, req.body, req.user.employee);
        if (!updated.success) {
            res.status(400).send(updated);
            return;
        }
        res.status(200).send(updated);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});
router.get('/api/attendance/all', auth, async (req, res) => {
    try {
        const attendances = await attendanceService.queryAttendance(req.query);
        if (!attendances.success) {
            res.status(404).send(attendances);
            return;
        }
        res.status(200).send(attendances);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});
module.exports = router;