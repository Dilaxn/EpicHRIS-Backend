const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const attachmentSchema = new mongoose.Schema({
    file: {
        type: Buffer,
        required: true
    },
    file_name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    size: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        trim: true,
        maxlength: 200,
    },
    mime_type: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
        lowercase: true
    },
    added_date: {
        type: Date,
        default: Date.now,
        required: true
    },
    modified_date: {
        type: Date,
        min: this.added_date
    },
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    modified_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    screen: {
        type: String,
        lowercase: true,
        trim: true,
        enum: ['personal', 'contact', 'emergency_contact', 'dependent', 'immigration', 'job', 'salary',
            'report_to', 'qualification', 'membership'],
        required: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }
})

attachmentSchema.plugin(idValidator);
attachmentSchema.set('toObject', {virtuals: true});
attachmentSchema.set('toJSON', {virtuals: true});

const Attachment = mongoose.model('Attachment', attachmentSchema);

module.exports = {
    attachmentSchema,
    Attachment
}




