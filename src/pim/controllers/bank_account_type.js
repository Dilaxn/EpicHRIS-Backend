const {BankAccountType} = require('../models/bank_account_type');

const addAnBankAccountType = async (req, res) => {
    try {
        const bankAccountType = new BankAccountType({
            ...req.body
        });

        if (!bankAccountType) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await bankAccountType.save();
        const final = bankAccountType.toObject();
        delete final.__v;
        res.status(201).send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const getAllBankAccountType = async (req, res) => {
    try {
        const bankAccountTypes = await BankAccountType.find({}).select('-__v');
        if (!bankAccountTypes || bankAccountTypes.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }

        res.send(bankAccountTypes);
    }catch (e) {
        res.status(500).send(e);
    }
}

const deleteBankAccountTypes = async (req, res) => {
    try {
        const ids = req.body.bank_account_types;

        if (!ids || !Array.isArray(ids), ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const response = [];

        for (const id of ids) {
            const bankAccountType = await BankAccountType.findById(id).select('-__v');

            if (bankAccountType) {
                await bankAccountType.remove();
                response.push(bankAccountType);
            }
        }

        if (response.length === 0) {
            res.status(404).send({message: 'no bank account types deleted'});
            return;
        }

        res.send(response);
    }catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
    addAnBankAccountType,
    getAllBankAccountType,
    deleteBankAccountTypes
}