const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator')
const projectActivitySchema = new mongoose.Schema({
    activityName: {
        type: String,
        required: true,
        trim: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    }
}, {versionKey: false});
const ProjectActivity = mongoose.model('ProjectActivity', projectActivitySchema);
module.exports = {projectActivitySchema, ProjectActivity};