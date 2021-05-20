const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const employeeSkillSchema = new mongoose.Schema({
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    },
    years_of_experience: {
        type: Number,
        min: 0,
        max: 50
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 100,
        minlength: 2
    },
    custom_fields: {},
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }
});

employeeSkillSchema.plugin(idValidator);
employeeSkillSchema.set('toObject', {virtuals: true});
employeeSkillSchema.set('toJSON', {virtuals: true});
const EmployeeSkill = mongoose.model('EmployeeSkill', employeeSkillSchema);
module.exports = {
    employeeSkillSchema,
    EmployeeSkill
}