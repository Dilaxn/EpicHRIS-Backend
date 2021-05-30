const {Customer} = require('./customerModel');
class CustomerService {
    async addCustomer(customer) {
        const newCustomer = new Customer({
            ...customer
        });
        await newCustomer.save();
        return {success: true, data: newCustomer};
    }

    async updateCustomer(id, update) {
        const allowedKeys = ['customerName', 'description'];
        const keys = Object.keys(update);
        const isValidOperation = keys.every((key) => {
            return allowedKeys.includes(key);
        })
        if (!isValidOperation) {
            return {success: false, message: 'invalid property added to the body'};
        }
        const customer = await Customer.findById(id);
        if (!customer) {
            return {success: false, message: 'customer not found'};
        }
        keys.forEach((key) => {
            customer[key] = update[key];
        })
        await customer.save();
        return {success: true, data: customer};
    }

    async deleteCustomer(id) {
        if (typeof id === 'string') {
            const deleted = await Customer.findByIdAndDelete(id);
            if (deleted) {
                return {success: true, data: deleted};
            }
            return {success: false, message: 'could not found'};
        }
        if (Array.isArray(id) && id.length > 0) {
           const deleted =  await Customer.deleteMany({_id: {$in: id}});
           if (deleted.deletedCount > 0) {
               return {success: true, deleted};
           }
           return {success: false, message: 'could not delete'};
        }
        return {success: false, message: 'could not delete'};
    }
    async getCustomers() {
        const customers = await Customer.find({});
        if (customers.length === 0) {
            return {success: false, message: 'could not found'};
        }
        return {success: true, data: customers};
    }
}

module.exports = CustomerService;