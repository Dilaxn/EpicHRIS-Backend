const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const {ProjectActivity} = require('../ProjectActivityComponent/projectActivityModel')
const projectSchema = new mongoose.Schema ({
    customerName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    projectName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    projectAdmin: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    projectDescription: {
        type: String,
        maxlength: 1000
    }

}, {versionKey: false, toJSON: {virtuals: true}});
projectSchema.plugin(idValidator);
projectSchema.virtual('projectActivities', {
    ref: 'ProjectActivity',
    localField: '_id',
    foreignField: 'project',
    justOne: false
})
projectSchema.pre('save', async function (next) {
    const doc = this;
    if (!doc.projectAdmin || doc.projectAdmin.length === 0) {
        next(new Error('project admin can not be empty'));
    }
    next();
});
projectSchema.pre('deleteOne', {document: false, query: true}, async function (next) {
    const query = this.getQuery();
    const project = await Project.findOne(query);
    if (project) {
        await ProjectActivity.deleteMany({project: project._id});
    }
    next()
});
projectSchema.pre('deleteMany', async function (next) {
    const query = this.getQuery();
    const projects = await Project.find(query);
    if (projects.length > 0) {
        const projectIds = projects.map((project) => project._id);
        await ProjectActivity.deleteMany({project: {$in: projectIds}});
    }
    next();
})
const Project = mongoose.model('Project', projectSchema);
module.exports = {projectSchema, Project};