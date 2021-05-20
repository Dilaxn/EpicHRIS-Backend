const mongoose = require('mongoose');
const validator = require('validator');
const idValidator = require('mongoose-id-validator');
const {Country} = require('../models/country');
const organizationSchema = new mongoose.Schema({
    organization_name: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },
    tax_id: {
        type: String,
        trim: true,
        maxlength: 50
    },
    registration_number: {
        type: String,
        trim: true,
        maxlength: 100
    },
    organization_phone: {
        type: String,
        trim: true,
        async validate(value) {
            const isValid = validator.isMobilePhone(value, 'any');
            if (!isValid) {
                throw new Error('organization_phone number invalid');
            }
        }

    },
    organization_email: {
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
    organization_fax: {
        type: String,
        trim: true,
        async validate(value) {
            const isValid = validator.isMobilePhone(value, 'any');
            if (!isValid) {
                throw new Error('organization_phone number invalid');
            }
        }
    },
    organization_street_1: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 50
    },
    organization_street_2: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 50
    },
    organization_city: {
        type: String,
        lowercase: true,
        trim: true,
        maxlength: 50
    },
    organization_province: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 50
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    },
    organization_postal_code: {
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
    organization_note: {
        type: String,
        maxlength: 1000
    }
})

organizationSchema.plugin(idValidator);
organizationSchema.set('toObject', {virtuals: true});
organizationSchema.set('toObject',{virtuals: true});

const Organization = mongoose.model('Organization', organizationSchema);
module.exports = {
    organizationSchema,
    Organization
}