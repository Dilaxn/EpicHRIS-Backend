const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator')
const {Country} = require('../models/country');
const validator = require('validator');
const {Locale} = require('../models/locale');
const {Job} = require('../../pim/models/job');
const {EmployeeReport} = require('../../pim/models/employee_report');

const organizationLocationSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        maxlength: 30,
        unique: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    province: {
        type: String,
        lowercase: true,
        trim: true,
        maxlength: 30
    },
    city: {
        type: String,
        lowercase: true,
        trim: true,
        maxlength: 30
    },
    address: {
        type: String,
        lowercase: true,
        trim: true,
        maxlength: 50
    },
    locale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Locale'
    },
    postal_code: {
        type: String,
        async validate(value) {
            const country = await Country.findById(this.country);
            if (country) {
                if (validator.isPostalCodeLocales.includes(country.code)) {
                    const isValid = validator.isPostalCode(value, country.code);
                    if (!isValid) {
                        throw new Error('postal code validation failed');
                    }

                    return;
                }
                const isValid = validator.isPostalCode(value, 'any');
                if (!isValid) {
                    throw new Error('postal code validation failed');
                }

                return;
            }

            const isValid = validator.isPostalCode(value, 'any');
            if (!isValid) {
                throw new Error('postal code validation failed')
            }

        }
    },
    phone: {
        type: String,
        trim: true,
        async validate(value) {
            const locale = await Locale.findById(this.locale);

            if (locale) {
                if (validator.isMobilePhoneLocales.includes(locale.tag)) {
                    const isValid = validator.isMobilePhone(value, locale.tag);
                    if (!isValid) {
                        throw new Error('home telephone number invalid');
                    }
                    return;
                }
                const isValid = validator.isMobilePhone(value, 'any');
                if (!isValid) {
                    throw new Error('home telephone number invalid');
                }
                return;
            }

            const isValid = validator.isMobilePhone(value, 'any');
            if (!isValid) {
                throw new Error('home telephone number invalid');
            }
        }
    },
    fax: {
        type: String,
        trim: true,
        async validate(value) {
            const locale = await Locale.findById(this.locale);

            if (locale) {
                if (validator.isMobilePhoneLocales.includes(locale.tag)) {
                    const isValid = validator.isMobilePhone(value, locale.tag);
                    if (!isValid) {
                        throw new Error('home telephone number invalid');
                    }
                    return;
                }
                const isValid = validator.isMobilePhone(value, 'any');
                if (!isValid) {
                    throw new Error('home telephone number invalid');
                }
                return;
            }

            const isValid = validator.isMobilePhone(value, 'any');
            if (!isValid) {
                throw new Error('home telephone number invalid');
            }
        }
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 200
    }
});

organizationLocationSchema.plugin(idValidator);
organizationLocationSchema.set('toObject', {virtuals: true});
organizationLocationSchema.set('toJSON', {virtuals: true});

organizationLocationSchema.virtual('number_of_employees', {
    ref: 'Job',
    localField: '_id',
    foreignField: 'location',
    count: true
})

organizationLocationSchema.pre('remove', async function (next) {
    const location = this;
    const jobs = await Job.find({location: location._id});
    if (jobs.length > 0) {
        for (const job of jobs) {
            job.location = undefined;
            await job.save();
        }
    }

    const reports = await EmployeeReport.find({'selected_criteria.location': location._id});
    if (reports.length > 0) {
        for (const report of reports) {
            report.selected_criteria.location = undefined;
            await report.save();
        }
    }

    next();
})

const OrganizationLocation = mongoose.model('OrganizationLocation', organizationLocationSchema);

module.exports = {
    organizationLocationSchema,
    OrganizationLocation
};