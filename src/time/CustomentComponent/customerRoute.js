const express = require('express');
const isAdmin = require('../../../middleware/admin');
const CustomerService = require('./CustomerService');
const supervisorOrAdmin = require("../../../../src-2021-05-27/middleware/supervisor_or_admin");
const customerService = new CustomerService();
const router = new express.Router();
router.post('/customers', isAdmin, async (req, res) => {
    try {
        const addedCustomer = await customerService.addCustomer(req.body);
        res.status(201).send(addedCustomer);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
});
router.get('/Customers', supervisorOrAdmin, async (req, res) => {
    try {
        const customers = await customerService.getCustomers();
        if (!customers.success) {
            res.status(404).send(customers);
            return;
        }
        res.status(200).send(customers);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
})
router.patch('/customers/:id', isAdmin, async (req, res) => {
    try {
        const updated = await customerService.updateCustomer(req.params.id, req.body);
        if (!updated.success) {
            res.status(400).send(updated);
            return;
        }
        res.status(200).send(updated);
    }catch (e) {
        res.status(500).send({success: false, err: e.message});
    }
})
router.delete('/customers', isAdmin, async (req, res) =>{
    try {
        const deleted = await customerService.deleteCustomer(req.body.id);
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
