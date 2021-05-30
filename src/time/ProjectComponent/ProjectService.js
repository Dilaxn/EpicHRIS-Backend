const {Project} = require('./projectModel');
class ProjectService {
    async addProject (project) {
        const newProject = new Project({
            ...project
        });
        await newProject.save();
        await newProject.populate({
            path: 'customerName projectAdmin',
            select: 'customerName description first_name last_name emp_id'
        }).execPopulate();
        return {success: true, data: newProject};
    }
    async queryProject(queryOption) {
        const baseFilter = {};
        if (queryOption.customerName) {
            baseFilter.customerName = queryOption.customerName;
        }
        if (queryOption.project) {
            baseFilter._id = queryOption.project;
        }
        if (queryOption.projectAdmin) {
            baseFilter.projectAdmin = queryOption.projectAdmin;
        }
        const projects = await Project.find(baseFilter).populate({
            path: 'customerName projectAdmin projectActivities',
            select: 'customerName description first_name last_name emp_id activityName'
        });
        if (projects.length === 0) {
            return {success: false, message: 'not found any projects'};
        }
        return {success: false, data: projects};
    }
    async isProjectAdmin(adminId, projectId) {
        const project = await Project.findOne({_id: projectId, projectAdmin: adminId});
        if (!project) {
            return null;
        }
        return project;
    }
    async updateAProject(projectId, update) {
        const allowedKeys = ['customerName', 'projectName', 'projectAdmin', 'projectDescription'];
        const keys = Object.keys(update);
        const isValidOps = keys.every((key) => {
            return allowedKeys.includes(key);
        })
        if (keys.length === 0) {
            return {success: false, message: 'no keys in the request'};
        }
        if (!isValidOps) {
            return {success: false, message: 'invalid key field added to the req.body'};
        }
        const project = await Project.findById(projectId);
        if (!project) {
            return {success: false, message: 'project not found'};
        }
        keys.forEach((key) => {
            project[key] = update[key];
        });
        await project.save();
        await project.populate({
            path: 'customerName projectAdmin',
            select: 'customerName description first_name last_name emp_id'
        }).execPopulate();
        return {success: true, data: project};
    }
    async deleteProjects(id) {
        if (Array.isArray(id) && id.length > 0) {
            const deleted = await Project.deleteMany({_id: {$in: id}});
            if (deleted.deletedCount > 0) {
                return {success: true, data: deleted};
            }
            return {success: false, data: deleted};
        }
        if (typeof id === 'string') {
            const deletedQuery = Project.deleteOne({_id: id});
            const deleted = await deletedQuery;
            if (deleted.deletedCount > 0) {
                return {success: true, data: deleted};
            }
            return {success: false, data: deleted};
        }
        return {success: false, message: 'id property has invalid value'};
    }
}
module.exports = ProjectService;