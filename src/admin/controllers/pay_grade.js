const {PayGrade} = require('../models/pay_grade');
const {PayGradeCurrency} = require('../models/pay_grade_currency');

const addAPayGrade = async (req, res) => {
    try {
        const payGrade = new PayGrade({
            ...req.body
        });

        if (!payGrade) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await payGrade.save();
        const response = payGrade.toObject();
        delete response.id;
        delete response.__v;
        res.status(201).send(response);
    }catch (e) {
        res.status(500).send(e);
    }
}

const getAPayGrade = async (req, res) => {
    try {
        const payGrade = await PayGrade.findById(req.params.id).select('-__v');

        if (!payGrade) {
            res.status(404).send({message: 'not found'});
            return;
        }

        const final = payGrade.toObject();
        delete final.id;
        res.send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const getAllPayGrades = async (req, res) => {
    try {
        const payGrades = await PayGrade.find({}).select('-__v');

        if (!payGrades) {
            res.status(404).send({message: 'not found'});
            return;
        }
        else if(payGrades.length === 0){
            res.send([]);
        }
        const final = [];
        payGrades.forEach((payGrade) => {
            const obj = payGrade.toObject();
            delete obj.id;
            final.push(obj);
        })
        res.send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const updateAPayGrade = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedKeys = ['name'];
    const isValidOperation = updates.every((update) => {
        return allowedKeys.includes(update);
    })

    if (!isValidOperation) {
        res.status(400).send({message: 'invalid request'});
        return;
    }

    try {
        const payGrade = await PayGrade.findById(req.params.id);

        if (!payGrade) {
            res.status(404).send({message: 'not found'});
            return;
        }

        updates.forEach((update) => {
            payGrade[update] = req.body[update];
        })

        await payGrade.save();
        const final = payGrade.toObject();
        delete final.id;
        delete final.__v;
        res.send(final);
    }catch (e) {
        res.status(500).send(e);
    }
}

const deletePayGrades = async (req, res) => {
    try {
        const ids = req.body.pay_grades;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        let response = [];

        for (const id of ids) {
            const payGrade = await PayGrade.findById(id).populate({
                path: 'pay_grade_currencies',
                select: 'currency min_salary max_salary'
            });

            if (payGrade) {
                if (!payGrade.pay_grade_currencies || payGrade.pay_grade_currencies === 0) {
                    await payGrade.remove();
                    const obj = payGrade.toObject();
                    delete obj.id;
                    delete obj.__v;
                    response.push(obj);
                }else {
                    for (const currency of payGrade.pay_grade_currencies){
                        const payGradeCurrency = await PayGradeCurrency.findById(currency._id);
                        await payGradeCurrency.remove();
                    }

                    await payGrade.remove();
                    const obj = payGrade.toObject();
                    delete obj.id;
                    delete obj.__v;
                    response.push(obj);
                }
            }

        }

        if (response.length === 0) {
            res.status(404).send({message: 'could not delete'});
            return;
        }

        res.send(response);
    }catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
    addAPayGrade,
    getAPayGrade,
    getAllPayGrades,
    updateAPayGrade,
    deletePayGrades

}
