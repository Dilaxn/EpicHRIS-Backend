const mongoose = require('mongoose');
const {Project} = require('../ProjectComponent/projectModel');
const _ = require('lodash');
const customerSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true,
        lowercase: true,
        get: (v) => _.startCase(v)
    },
    description: {
        type: String,
        maxlength: 500,
    }
}, {versionKey: false, toJSON: {getters: true}});
customerSchema.post('findOneAndDelete', async function (res, next) {
    if (res._id) {
        await Project.deleteMany({customerName: res._id});
    }
    next();
})
customerSchema.pre('deleteMany', async function (next) {
    const query = this.getQuery();
    const customers = await Customer.find(query);
    if (customers.length > 0) {
        const customerId = customers.map((customers) => customers._id);
        await Project.deleteMany({customerName: {$in: customerId}});
    }
    next();
})
const Customer = mongoose.model('Customer', customerSchema);
module.exports = {customerSchema, Customer};