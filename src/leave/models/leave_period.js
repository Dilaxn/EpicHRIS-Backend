const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const moment = require('moment');
moment().format();

const isValidDate = (month, date) => {
    const thirtyOne = ['January', 'March', 'May', 'July', 'August', 'October', 'December'];
    const thirty = ['April', 'June', 'September', 'November'];
    if (date < 1) {
        return false;
    }
    if (month === 'February' && date  > 28) {
        return false;
    }

    if (thirtyOne.includes(month) && date > 31) {
        return false;
    }

    if (thirty.includes(month) && date > 30) {
        return false;
    }

    return true;
}

const leavePeriodSchema = new mongoose.Schema({
    start_month: {
        type: String,
        enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'],
        required: true,
        trim: true
    },
    start_date: {
        type: Int32,
        max: 31,
        min: 1,
        required: true,
        validate (value) {
            if (!isValidDate(this.start_month, value)) {
                throw new Error('invalid start date!!!');
            }
        }
    }
})

leavePeriodSchema.set('toObject', {virtuals: true});
leavePeriodSchema.set('toJSON', {virtuals: true});

leavePeriodSchema.virtual('current_leave_period').get(function (value, virtual, doc) {
    const currentYear = moment().year();
    let startMonth;
    switch (this.start_month) {
        case 'January':
            startMonth = 1;
            break;
        case 'February':
            startMonth = 2;
            break;
        case 'March':
            startMonth = 3;
            break;
        case 'April':
            startMonth = 4;
            break;
        case 'May':
            startMonth = 5;
            break;
        case 'June':
            startMonth = 6;
            break;
        case 'July':
            startMonth = 7;
            break;
        case 'August':
            startMonth = 8;
            break;
        case 'September':
            startMonth = 9;
            break;
        case 'October':
            startMonth = 10;
            break;
        case 'November':
            startMonth = 11;
            break;
        case 'December':
            startMonth = 12;
            break;
    }

    const startDate = moment(`${currentYear}-${startMonth}-${this.start_date}`, 'YYYY-M-D');
    const endDate = startDate.clone().add(1, 'year').subtract(1, 'day');
    return {
        startDate: {
            timeStamp: startDate,
            readable: startDate.format("YYYY-MM-DD")
        },
        endDate: {
            timeStamp: endDate,
            readable: endDate.format("YYYY-MM-DD")
        }
    };
});

leavePeriodSchema.virtual('end_date').get(function (value, virtual, doc) {
    const currentYear = moment().year();
    let month;
    switch (this.start_month) {
        case 'January':
            month = 1;
            break;
        case 'February':
            month = 2;
            break;
        case 'March':
            month = 3;
            break;
        case 'April':
            month = 4;
            break;
        case 'May':
            month = 5;
            break;
        case 'June':
            month = 6;
            break;
        case 'July':
            month = 7;
            break;
        case 'August':
            month = 8;
            break;
        case 'September':
            month = 9;
            break;
        case 'October':
            month = 10;
            break;
        case 'November':
            month = 11;
            break;
        case 'December':
            month = 12;
            break;
    }

    const date = moment(`${currentYear}-${month}-${this.start_date}`, 'YYYY-M-D');
    return date.add(1, 'y').subtract(1, 'd').format("MMMM DD");
})

const LeavePeriod = mongoose.model('LeavePeriod', leavePeriodSchema);

module.exports = {
    leavePeriodSchema,
    LeavePeriod
}
