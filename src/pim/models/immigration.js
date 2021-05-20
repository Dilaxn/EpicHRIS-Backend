const mongoose = require('mongoose');
const validator = require('validator');
const {Country} = require('../../admin/models/country');
const idValidator = require('mongoose-id-validator');


const immigrationSchema = new mongoose.Schema({
    document: {
        type: String,
        required: true,
        lowercase: true,
        enum: ['passport', 'visa']
    },
    issued_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    number: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 20,
        async validate(value) {
            if (this.document === 'passport') {
                const country = await Country.findById(this.issued_by);
                if(country) {
                    const available = [ 'AM', 'AR', 'AT', 'AU', 'BE', 'BG', 'BY', 'CA', 'CH',
                        'CN', 'CY', 'CZ', 'DE', 'DK', 'DZ', 'EE', 'ES', 'FI', 'FR', 'GB', 'GR',
                        'HR', 'HU', 'IE', 'IN', 'IS', 'IT', 'JP', 'KR', 'LT', 'LU', 'LV', 'MT',
                        'NL', 'PO', 'PT', 'RO', 'RU', 'SE', 'SL', 'SK', 'TR', 'UA', 'US' ];

                    if (available.includes(country.code)) {
                       const isValid = validator.isPassportNumber(value, country.code);
                       if (!isValid) {
                           throw new Error('passport number validation failed');
                       }
                    }
                }
            }
        }
    },
    issued_date: {
        type: Date,
        min: '2000-01-01',
        max: Date.now(),
    },
    expiry_date: {
        type: Date,
        min: Date.now(),
        validate(value) {
           const max = new Date().getTime() + 630720000000;
           if (value.getTime() > max) {
               throw new Error('expiry date should be below ' + new Date(max).toISOString());
           }
        }
    },
    eligible_status: {
        type: String,
        maxlength: 20,
        trim: true,
    },
    eligible_review_date: {
        type: Date
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 100
    },
    custom_fields: {},
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }
});

immigrationSchema.plugin(idValidator);

immigrationSchema.set('toJSON', {virtuals: true});
immigrationSchema.set('toObject', {virtuals: true});


const Immigration = mongoose.model('Immigration', immigrationSchema);
module.exports = {immigrationSchema, Immigration};