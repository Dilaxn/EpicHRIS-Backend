const {PayGradeCurrency} = require('../models/pay_grade_currency');
const {PayGrade} = require('../models/pay_grade');

const assignCurrencyForAPayGrade = async (req, res) => {
    try {
        const payGradeCurrency = new PayGradeCurrency({
            ...req.body,
            pay_grade: req.params.id
        })
        const existingCurrency = await PayGradeCurrency.findOne({currency_type: req.body.currency_type, pay_grade: req.params.id});
        if (existingCurrency) {
            res.status(400).send({message: 'already exist'});
            return;
        }

        if (!payGradeCurrency) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await payGradeCurrency.save();
        await payGradeCurrency.populate({
            path: 'currency_type pay_grade',
            select: 'currency code name'
        }).execPopulate();
        const final = payGradeCurrency.toObject();
        delete final.__v;
        delete final.pay_grade.id;
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readACurrencyForAPayGrade = async (req, res) => {
    try {
        const payGradeCurrency = await PayGradeCurrency.findOne({
            _id: req.params.currency_id,
            pay_grade: req.params.id
        }).populate({
            path: 'currency_type pay_grade',
            select: 'currency code name'
        });

        if (!payGradeCurrency) {
            res.status(404).send({message: 'not found'});
            return;
        }
        const final = payGradeCurrency.toObject();
        delete final.__v;
        delete final.pay_grade.id;
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readAllCurrenciesForAPayGrade = async (req, res) => {
    try {
        const payGrade = await PayGrade.findById(req.params.id).populate({
            path: 'pay_grade_currencies',
            select: '-__v',
            populate: {
                path: 'currency_type',
                select: 'code currency'
            }
        }).select('name pay_grade_currencies');
        if (!payGrade || !payGrade.pay_grade_currencies || payGrade.pay_grade_currencies.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }
        const final = payGrade.toObject();
        delete final.id;
        final.pay_grade_currencies.forEach((currency) => {
            delete currency.pay_grade;
        })
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const updateACurrencyOfAPayGrade = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedKeys = ['currency_type', 'min_salary', 'max_salary'];
    const isValidOperation = updates.every((update) => {
        return allowedKeys.includes(update);
    })

    if (!isValidOperation || updates.length === 0) {
        res.status(400).send({message: 'invalid request'});
        return;
    }

    try {
        const pay_grade_currency = await PayGradeCurrency.findOne({
            _id: req.params.currency_id,
            pay_grade: req.params.id
        });
        if (!pay_grade_currency) {
            res.status(404).send({message: 'not found'});
            return;
        }
        updates.forEach((update) => {
            pay_grade_currency[update] = req.body[update];
        })

        await pay_grade_currency.save();
        await pay_grade_currency.populate({
            path: 'currency_type pay_grade',
            select: 'currency code name'
        }).execPopulate();
        const final = pay_grade_currency.toObject();
        delete final.id;
        delete final.__v;
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const deletePayGradeCurrenciesOfAPayGrade = async (req, res) => {
    const ids = req.body.pay_grade_currencies;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        res.status(400).send({message: 'invalid request'});
        return;
    }

    try {
        let response = [];

        for (const id of ids) {
            const deleted = await PayGradeCurrency.findOne({pay_grade: req.params.id, _id: id}).select('-__v');
            if (deleted) {
                await deleted.remove();
                response.push(deleted);
            }
        }

        if (!response || response.length === 0) {
            res.status(404).send({message: 'none deleted'});
            return;
        }

        res.send(response);
    }catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
    assignCurrencyForAPayGrade,
    readACurrencyForAPayGrade,
    readAllCurrenciesForAPayGrade,
    updateACurrencyOfAPayGrade,
    deletePayGradeCurrenciesOfAPayGrade
}