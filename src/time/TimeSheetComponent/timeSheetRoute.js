const express = require('express');
const auth = require('../../../middleware/auth');
const isAdmin = require('../../../middleware/admin');
const supervisorOrAdmin = require('../../../middleware/supervisor_or_admin');
const TimeSheetService = require('./TimeSheetService');
const timeSheetService = new TimeSheetService();
const router = new express.Router();
router.get('/api/timeSheets/weeks/:id', auth, async (req, res) => {
    try {
        const timeSheet = await timeSheetService.readAnEmployeeTimeSheet(req.user.employee, req.params.id);
        if (!timeSheet.success) {
            res.status(400).send(timeSheet);
            return;
        }
        res.status(200).send(timeSheet);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});
router.get('/api/employees/:emp_id/timeSheets/weeks/:id', supervisorOrAdmin, async (req, res) => {
    try {
        const employeeTimeSheet = await timeSheetService.readAnEmployeeTimeSheet(req.params.emp_id, req.params.id);
        if (!employeeTimeSheet.success) {
            const statusCode = 400;
            res.status(statusCode).send(employeeTimeSheet);
            return;
        }
        res.status(200).send(employeeTimeSheet);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
})


router.patch('/api/timeSheets/:id/update', auth, async (req, res) => {
    try {
        const updated = await timeSheetService.updateEmployeeTimeSheet(req.user.employee, req.params.id, req.body, 'not-submitted', req.user.employee);
        if (!updated.success) {
            res.status(400).send(updated);
            return;
        }
        res.status(201).send(updated);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});
router.patch('/api/employees/:emp_id/timeSheets/:id/update', supervisorOrAdmin, async (req, res) => {
    try {
        const updatedEmployeeTimeSheet = await timeSheetService.updateEmployeeTimeSheet(req.params.emp_id, req.params.id, req.body, {$in: ['not-submitted', 'submitted']}, req.user.employee);
        if (!updatedEmployeeTimeSheet.success) {
            res.status(400).send(updatedEmployeeTimeSheet);
            return;
        }
        res.status(201).send(updatedEmployeeTimeSheet);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});


router.patch('/api/timeSheets/:id/submit', auth, async (req, res) => {
    try {
        const submitted = await timeSheetService.submitEmployeeTimeSheet(req.user.employee, req.params.id, req.body, req.user.employee);
        if (!submitted.success) {
            res.status(400).send(submitted);
            return;
        }
        res.status(200).send(submitted);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});
router.patch('/api/employees/:emp_id/timeSheets/:id/submit', auth, async (req, res) => {
    try {
        const employeeId = req.params.emp_id;
        const timeSheetId = req.params.id;
        const myId = req.user.employee;
        const submitted = await timeSheetService.submitEmployeeTimeSheet(employeeId, timeSheetId, req.body, myId);
        if (!submitted.success) {
            res.status(400).send(submitted);
            return;
        }
        res.status(200).send(submitted);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});

router.get('/api/timeSheets/mine', auth, async (req, res) => {
    try {
        const myTimeSheets = await timeSheetService.queryMyTimeSheets(req.query.timeSheetWeek, req.query.status, req.user.employee);
        if (!myTimeSheets.success) {
            res.status(404).send(myTimeSheets);
            return;
        }
        res.status(200).send(myTimeSheets);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
})
//req.query = { employee, timeSheetWeek, status }
router.get('/api/subordinates/timeSheets', auth, async (req, res) => {
    try {
        const timeSheets = await timeSheetService.queryMySubordinatesTimeSheets(req.query.employee, req.query.timeSheetWeek, req.query.status, req.user.employee);
        if (!timeSheets.success) {
            res.status(404).send(timeSheets);
            return;
        }
        res.status(200).send(timeSheets);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});
//req.query = { employee, timeSheetWeek, status }
router.get('/api/timeSheets/all', isAdmin, async (req, res) => {
    try {
        const submitted = await timeSheetService.queryAllTimeSheets(req.query.employee, req.query.timeSheetWeek, req.query.status);
        if (!submitted.success) {
            res.status(404).send(submitted);
            return;
        }
        res.status(200).send(submitted);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});

//{emp_id: employee ID, id: time sheet ID, action: submitted/approved/rejected/reset }
router.patch('/api/employees/:emp_id/timeSheets/:id/:action', supervisorOrAdmin, async (req, res) => {
    try {
        const timeSheet = await timeSheetService.submitOrApproveOrResetOrReject(req.params.id, req.params.emp_id, req.user.employee, req.body.comment, req.params.action);
        if (!timeSheet.success) {
            res.status(400).send(timeSheet);
            return;
        }
        res.status(200).send(timeSheet);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
})

module.exports = router;