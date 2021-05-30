const {ProjectActivity} = require('./projectActivityModel');
const ProjectService = require('../ProjectComponent/ProjectService');
class ProjectActivityService {
    #projectService;
    constructor(ProjectServiceClass = ProjectService) {
        this.#projectService = new ProjectServiceClass();
    }
    async isAdminOrProjectAdmin(projectId, user) {
        if (user.role === 'admin') {
            return true;
        }
        const project = await this.#projectService.isProjectAdmin(user.employee, projectId);
        return !!project;

    }
    async addProjectActivity(projectId, projectActivity, user) {
        if (await this.isAdminOrProjectAdmin(projectId, user)) {
            const newProjectActivity = new ProjectActivity({
                project: projectId,
                ...projectActivity
            });
            await newProjectActivity.save();
            await newProjectActivity.populate({
                path: 'project',
                select: 'projectName projectDescription'
            }).execPopulate();
            return {success: true, date: newProjectActivity};
        }
        return {success: false, message: 'you are not allowed to add project activity'};
    }
    async copyProjectActivity(projectIdToCopy, projectIdFromCopy, user) {
        if (await this.isAdminOrProjectAdmin(projectIdToCopy, user) && await this.isAdminOrProjectAdmin(projectIdFromCopy, user)) {
            const projectActivities = await ProjectActivity.find({project: projectIdFromCopy});
            if (projectActivities.length === 0) {
                return {success: false, message: 'there are no activities found'};
            }
            const activities = projectActivities.map((projectActivity) => {
                return new ProjectActivity({
                    activityName: projectActivity.activityName,
                    project: projectIdToCopy
                })
            });
            const inserted = await ProjectActivity.insertMany(activities);
            return {success: true, data: inserted};
        }
        return {success: false, message: 'you are not allowed to copy activities'};
    }
    async getProjectActivities(projectId) {
        const activities = await ProjectActivity.find({project: projectId});
        if (activities.length === 0) {
            return {success: false, message: 'activities not found'};
        }
        return {success: true, data: activities};
    }
    async updateProject(projectId, activityId, user, activityName) {
        if (await this.isAdminOrProjectAdmin(projectId, user)) {
            const projectActivity = await ProjectActivity.findOneAndUpdate({project: projectId, _id: activityId}, {$set: {activityName}}, {new: true, runValidators: true});
            if (projectActivity) {
                return {success: true, data: projectActivity};
            }
            return {success: false, message: 'unable to update'};
        }
        return {success: false, message: 'you are not allowed to update'};

    }
    async deleteProjectActivities(projectId, user, activity) {
        if (await this.isAdminOrProjectAdmin(projectId, user)) {
            if (Array.isArray(activity) && activity.length > 0) {
                const deleted = await ProjectActivity.deleteMany({project: projectId, _id: {$in: activity}});
                if (deleted.deletedCount > 0) {
                    return {success: true, data: deleted};
                }
                return {success: false, data: deleted};
            }
            if (typeof activity === 'string') {
                const deleted = await ProjectActivity.findOneAndDelete({project: projectId, _id: activity});
                if (deleted) {
                    return {success: true, data: deleted};
                }
                return {success: false, message: 'could not delete'};
            }
        }
        return {success: false, message: 'you are not allowed to delete'};
    }

}
module.exports = ProjectActivityService;