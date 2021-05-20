const mongoose = require('mongoose');
const validator = require('validator');
const idValidator = require('mongoose-id-validator');
const {Country} = require('../../admin/models/country');
const {Locale} = require('../../admin/models/locale');


const contactSchema = new mongoose.Schema({
    street1: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 20
    },
    street2: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 20

    },
    city: {
        type: String,
        lowercase: true,
        trim: true,
        maxlength: 20
    },
    province: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 20
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
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
    home_tel: {
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
    mobile: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
        async validate(value) {
            const locale = await Locale.findById(this.locale);

            if (locale) {
                if (validator.isMobilePhoneLocales.includes(locale.tag)) {
                    const isValid = validator.isMobilePhone(value, locale.tag);
                    if (!isValid) {
                        throw new Error('mobile number invalid');
                    }
                    return;
                }
                const isValid = validator.isMobilePhone(value, 'any');
                if (!isValid) {
                    throw new Error('mobile number invalid');
                }
                return;
            }

            const isValid = validator.isMobilePhone(value, 'any');
            if (!isValid) {
                throw new Error('mobile number invalid');
            }
        }

    },
    work_tel: {
        type: String,
        trim: true,
        async validate(value) {
            const locale = await Locale.findById(this.locale);

            if (locale) {
                if (validator.isMobilePhoneLocales.includes(locale.tag)) {
                    const isValid = validator.isMobilePhone(value, locale.tag);
                    if (!isValid) {
                        throw new Error('work telephone number invalid');
                    }
                    return;
                }
                const isValid = validator.isMobilePhone(value, 'any');
                if (!isValid) {
                    throw new Error('work telephone number invalid');
                }
                return;
            }

            const isValid = validator.isMobilePhone(value, 'any');
            if (!isValid) {
                throw new Error('home telephone number invalid');
            }
        }
    },
    work_email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        sparse: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('email validation failed');
            }
        }
    },
    other_email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        sparse: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('email validation failed');
            }
        }
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
        unique: true
    },
    custom_fields: {}
});

contactSchema.plugin(idValidator);
contactSchema.set('toObject', {virtuals: true});
contactSchema.set('toJSON', {virtuals: true});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = {contactSchema, Contact};