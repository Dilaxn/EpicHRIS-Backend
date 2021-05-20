const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const validator = require('validator');

const customFieldSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true,
        lowercase: true,
        minlength: 3
    },
    screen: {
        type: String,
        required: true,
        lowercase: true,
        enum: ['personal', 'contact', 'emergency_contact', 'dependent', 'immigration', 'job',
        'salary', 'report_to', 'work_experience', 'education', 'skill', 'language', 'license', 'membership']
    },
    field_type: {
        type: String,
        required: true,
        enum: ['String', 'Number']
    },
    choice: [{
        type: String,
        maxlength: 50
    }]

});
customFieldSchema.plugin(idValidator);
customFieldSchema.set('toObject', {virtuals: true});
customFieldSchema.set('toJSON', {virtuals: true});

customFieldSchema.statics.generateCustomSchema = async (screen) => {
    const customFields = await CustomField.find({screen: screen});
    if (!customFields || customFields.length === 0) {
        return undefined;
    }

    const final = [];

    customFields.forEach((customField) => {
        let customSchema = {};
        customSchema[customField.name] = {};
        customSchema[customField.name].type = (customField.field_type === 'String') ? String: Number;
        if (customField.choice.length > 0) {
            customSchema[customField.choice].enum = customField.choice;
        }

        final.push(customSchema)

    });

    if (final.length === 0) {
        return undefined;
    }

    return final;
}

customFieldSchema.statics.getCustomFieldsName = async (screen) => {
    const customFields = await CustomField.find({screen}).select('name');
    if (!customFields || customFields.length === 0) {
        return [];
    }

    const final = [];
    customFields.forEach((customField) => {
        final.push(customField.name);
    })

    return final;

}


customFieldSchema.statics.validateAField = async (screen, name, value) => {
    const customField = await CustomField.findOne({screen, name});
    if (!customField) {
        throw new Error('custom field not found');
    }

    if (customField.field_type === 'String') {
        if (typeof value !== 'string') {
            if (value !== null) {
                throw new Error('validation failed: ' + value + ' is not a string');
            }
        }

        if (typeof value === 'string') {
            if (value.length > 100) {
                throw new Error('validation failed: ' + value + ' should be less than length of 100 character');
            }

            if (value === 'null') {
                value = null;
            }
        }
    }

    if (customField.field_type === 'Number') {
        if (!Number.isFinite(value)) {
            if (value !== null) {
                if (typeof value !== 'string') {
                    throw new Error('validation failed: ' + value + ' is not a number');
                }

                if (!validator.isFloat(value) && value !== 'null') {
                    throw new Error('validation failed: ' + value + ' is not a number');
                }

                if (value === 'null') {
                    value = null;
                }else {
                    value = Number(value);
                }
            }
        }
    }

    if (customField.choice.length > 0) {
        if (!customField.choice.includes(value)) {
            if (value !== null) {
                throw new Error('validation failed: ' + value + ' is not allowed');
            }
        }
    }

    return value;
}

const CustomField = mongoose.model('CustomField', customFieldSchema);
module.exports = {
    customFieldSchema,
    CustomField
}