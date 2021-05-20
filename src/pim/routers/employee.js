const express = require('express');
const {createEmployee, addEmployees, readMyPersonalDetail, readEmployeePersonalDetail, updateMyPersonalDetail,
    updateEmployeePersonalDetail, readAProfilePicture, updateMyProfilePicture, updateAnEmployeeProfilePicture,
    deleteEmployees, queryEmployees} = require('../controllers/employee');
const {updateMyContactDetail, updateEmployeeContactDetail, readMyContactInfo, readAnEmployeeContact} = require('../controllers/contact.js');
const { addMyEmergencyContact, updateMyEmergencyContact, readMyEmergencyContact,
    deleteMyEmergencyContact, deleteMyMultiEmergencyContacts, readMyAllEmergencyContacts,
    addAnEmergencyContact, updateAnEmergencyContact, readAnEmergencyContact, deleteMultiEmergencyContacts,
    deleteMyAllEmergencyContacts, deleteAllEmergencyContactsForAnEmployee, readAllEmergencyContactsForAnEmployee } = require('../controllers/emergency_contact');
const { addSupervisor, deleteSupervisor, getAllSupervisors, getMyAllSupervisors, updateASupervisorForAnEmployee,
    addASubordinateToAnEmployee, updateASubordinateForAnEmployee, deleteSubordinate, readMyAllSubordinates,
    readAllSubordinatesForAnEmployee, readASubordinateForAnEmployee, readASupervisorForAnEmployee } = require('../controllers/report_to');
const {addMyDependent, addADependentForAnEmployee, readMyDependent, readADependentForAnEmployee,
    readMyAllDependents, readAllDependentsForAnEmployee, updateMyDependent, updateADependentOfAnEmployee,
    deleteMyDependent, deleteADependantOfAnEmployee, deleteMyMultipleDependents, deleteMultipleDependentsOfAnEmployee } = require('../controllers/dependent');
const { addAnImmigrationRecordForMe, addAnImmigrationRecordForAnEmployee, readAnImmigrationRecordForMe,
    readAnImmigrationRecordForAnEmployee, readMyAllImmigrationRecords, readAllImmigrationRecordsOfAnEmployee,
    updateAnImmigrationRecordOfMine, updateAnImmigrationOfAnEmployee, deleteMultipleImmigrationRecordsOfMine,
    deleteMultipleImmigrationRecordsOfAnEmployee } = require('../controllers/immigration');
const {readMyJob, readMyContract, readAnEmployeeJob, readAContract, updateAnEmployeeJob } = require('../controllers/job');
const {terminateAnEmployee, activateAnEmployee} = require('../controllers/termination');
const {addASalaryComponentToAnEmployee, readASalaryComponentOfMine, readASalaryComponentOfAnEmployee, readMyAllSalaryComponents,
    readAllSalaryComponentsOfAnEmployee, updateASalaryComponentOfAnEmployee, deleteSalaryComponentsOfAnEmployee} = require('../controllers/salary_component');
const {addMyWorkExperience, addAWorkExperienceForAnEmployee, getAWorkExperienceOfMine, readAWorkExperienceOfAnEmployee,
    realMyAllWorkExperiences, realAllWorkExperiencesOfMine, updateMyWorkExperience, updateAWorkExperienceOfAnEmployee,
    deleteMyWorkExperiences, deleteWorkExperiencesOfAnEmployee} = require('../controllers/work_experience');
const {addMyEducation, addEducationOfAnEmployee, readMyEducation, readEducationOfAnEmployee, readMyAllEducation,
    readAllEducationOfAnEmployee, updateEducationOfMine, updateEducationOfAnEmployee, deleteMyEducations, deleteEducationsOfAnEmployee} = require('../controllers/education');
const {addMySkill, addASkillToAnEmployee, getMySkill, readASkillOfAnEmployee, readMyAllSkills,
    readAllSkillsOfAnEmployee, updateMySkill, updateASkillOfAnEmployee, deleteMySkills, deleteSkillsOfAnEmployee} = require('../controllers/employee_skill');
const {addMyLanguage, addALanguageOfAnEmployee, readMyLanguage, readALanguageOfAnEmployee,
    readMyAllLanguages, readAllLanguagesOfAnEmployee, updateMyLanguage, updateALanguageOfAnEmployee,
    deleteMyLanguages, deleteLanguagesOfAnEmployee} = require('../controllers/employee_language');
const {addMyLicense, addALicenseOfAnEmployee, readMyLicense, readALicenseOfAnEmployee, getMyAllLicenses,
    readAllLicensesOfAnEmployee, updateMyLicense, updateALicenseOfAnEmployee, deleteMyLicenses, deleteLicensesOfAnEmployee,} = require('../controllers/employee_license');
const {addMyMembership, addAMembershipToAnEmployee, readMyMembership, readAMembershipOfAnEmployee, readAllMyMemberships,
    readAllMembershipsOfAnEmployee, updateMyMembership, updateAMembershipOfAnEmployee, deleteMyMemberships,
    deleteMembershipsOfAnEmployee} = require('../controllers/employee_membership');
const {addMyAttachment, addAnAttachmentOfEmployee, readMyAttachment, readAnAttachmentOfAnEmployee,
    readAllMyAttachmentsForAScreen, readAllAttachmentsOfAScreenForAnEmployee, updateMyAttachment,
    updateAttachmentOfAnEmployee, deleteMyAttachments, deleteAttachmentsOfAnEmployee} = require('../controllers/attachment');


const {pdfUpload, profilePicUpload, employeeUpload, attachmentUpload} = require('../../../middleware/file_upload');
const error = require('../../../middleware/error');

const router = new express.Router();
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');
const supervisorOrAdmin = require('../../../middleware/supervisor_or_admin');


router.post('/employees', isAdmin, profilePicUpload.single('avatar'), createEmployee, error);
router.post('/employees/import', isAdmin, employeeUpload.single('employee_list'), addEmployees, error);
router.get('/employees/me/personal_detail', auth, readMyPersonalDetail );
router.get('/employees/:emp_id/personal_detail', supervisorOrAdmin, readEmployeePersonalDetail);
router.patch('/employees/me/personal_detail', auth, updateMyPersonalDetail);
router.patch('/employees/:emp_id/personal_detail', supervisorOrAdmin, updateEmployeePersonalDetail);
router.get('/employees/:emp_id/avatar', auth, readAProfilePicture);
router.patch('/employees/me/avatar', auth, profilePicUpload.single('avatar'), updateMyProfilePicture, error);
router.patch('/employees/:emp_id/avatar', supervisorOrAdmin, profilePicUpload.single('avatar'), updateAnEmployeeProfilePicture, error);
router.delete('/employees', isAdmin, deleteEmployees);
router.get('/employees', auth, queryEmployees);

router.patch('/employees/me/contact', auth, updateMyContactDetail);
router.patch('/employees/:emp_id/contact', supervisorOrAdmin, updateEmployeeContactDetail);
router.get('/employees/me/contact', auth, readMyContactInfo);
router.get('/employees/:emp_id/contact', supervisorOrAdmin, readAnEmployeeContact);

router.post('/employees/me/emergency_contacts', auth, addMyEmergencyContact);
router.post('/employees/:emp_id/emergency_contacts', supervisorOrAdmin, addAnEmergencyContact);
router.patch('/employees/me/emergency_contacts/:id', auth, updateMyEmergencyContact);
router.patch('/employees/:emp_id/emergency_contacts/:id', supervisorOrAdmin, updateAnEmergencyContact);
router.get('/employees/me/emergency_contacts/:id', auth, readMyEmergencyContact);
router.get('/employees/:emp_id/emergency_contacts/:id', supervisorOrAdmin, readAnEmergencyContact);
router.delete('/employees/me/emergency_contacts/:id', auth, deleteMyEmergencyContact);
router.delete('/employees/me/emergency_contacts', auth, deleteMyMultiEmergencyContacts);
router.delete('/employees/:emp_id/emergency_contacts', supervisorOrAdmin, deleteMultiEmergencyContacts);
router.delete('/employees/me/emergency_contacts/delete/all', auth, deleteMyAllEmergencyContacts);
router.delete('/employees/:emp_id/emergency_contacts/delete/all', supervisorOrAdmin, deleteAllEmergencyContactsForAnEmployee);
router.get('/employees/me/emergency_contacts', auth, readMyAllEmergencyContacts);
router.get('/employees/:emp_id/emergency_contacts', supervisorOrAdmin, readAllEmergencyContactsForAnEmployee);

router.post('/employees/:emp_id/supervisors', isAdmin, addSupervisor);
router.patch('/employees/:emp_id/supervisors/:sup_id', isAdmin, updateASupervisorForAnEmployee);
router.delete('/employees/:emp_id/supervisors/:sup_id', isAdmin, deleteSupervisor);
router.get('/employees/me/supervisors', auth, getMyAllSupervisors);
router.get('/employees/:emp_id/supervisors', supervisorOrAdmin, getAllSupervisors);
router.get('/employees/:emp_id/supervisors/:sup_id', supervisorOrAdmin, readASupervisorForAnEmployee);

router.post('/employees/:emp_id/subordinates', isAdmin, addASubordinateToAnEmployee);
router.patch('/employees/:emp_id/subordinates/:sub_id', isAdmin, updateASubordinateForAnEmployee);
router.delete('/employees/:emp_id/subordinates/:sub_id', isAdmin, deleteSubordinate);
router.get('/employees/me/subordinates', auth, readMyAllSubordinates);
router.get('/employees/:emp_id/subordinates', supervisorOrAdmin, readAllSubordinatesForAnEmployee);
router.get('/employees/:emp_id/subordinates/:sub_id', supervisorOrAdmin, readASubordinateForAnEmployee);

router.post('/employees/me/dependents', auth, addMyDependent);
router.post('/employees/:emp_id/dependents', supervisorOrAdmin, addADependentForAnEmployee);
router.get('/employees/me/dependents/:dep_id', auth, readMyDependent);
router.get('/employees/:emp_id/dependents/:dep_id', supervisorOrAdmin, readADependentForAnEmployee);
router.get('/employees/me/dependents', auth, readMyAllDependents);
router.get('/employees/:emp_id/dependents', supervisorOrAdmin, readAllDependentsForAnEmployee);
router.patch('/employees/me/dependents/:dep_id', auth, updateMyDependent);
router.patch('/employees/:emp_id/dependents/:dep_id', supervisorOrAdmin, updateADependentOfAnEmployee);
router.delete('/employees/me/dependents/:dep_id', auth, deleteMyDependent);
router.delete('/employees/:emp_id/dependents/:dep_id', supervisorOrAdmin, deleteADependantOfAnEmployee);
router.delete('/employees/me/dependents', auth, deleteMyMultipleDependents);
router.delete('/employees/:emp_id/dependents', supervisorOrAdmin, deleteMultipleDependentsOfAnEmployee);

router.post('/employees/me/immigrations', auth, addAnImmigrationRecordForMe);
router.post('/employees/:emp_id/immigrations', supervisorOrAdmin, addAnImmigrationRecordForAnEmployee);
router.get('/employees/me/immigrations/:immigration_id', auth, readAnImmigrationRecordForMe);
router.get('/employees/:emp_id/immigrations/:immigration_id', supervisorOrAdmin, readAnImmigrationRecordForAnEmployee);
router.get('/employees/me/immigrations', auth, readMyAllImmigrationRecords);
router.get('/employees/:emp_id/immigrations', supervisorOrAdmin, readAllImmigrationRecordsOfAnEmployee);
router.patch('/employees/me/immigrations/:immigration_id', auth, updateAnImmigrationRecordOfMine);
router.patch('/employees/:emp_id/immigrations/:immigration_id', supervisorOrAdmin, updateAnImmigrationOfAnEmployee);
router.delete('/employees/me/immigrations', auth, deleteMultipleImmigrationRecordsOfMine);
router.delete('/employees/:emp_id/immigrations', supervisorOrAdmin, deleteMultipleImmigrationRecordsOfAnEmployee);

router.get('/employees/me/jobs', auth, readMyJob);
router.get('/employees/me/jobs/contract/detail', auth, readMyContract);
router.get('/employees/:emp_id/jobs', supervisorOrAdmin, readAnEmployeeJob);
router.get('/employees/:emp_id/jobs/contract/detail', supervisorOrAdmin, readAContract);
router.patch('/employees/:emp_id/jobs', pdfUpload.single('contract'), isAdmin, updateAnEmployeeJob);

router.post('/employees/:emp_id/terminate', isAdmin, terminateAnEmployee);
router.delete('/employees/:emp_id/activate', isAdmin, activateAnEmployee);

router.post('/employees/:emp_id/salary_components', isAdmin, addASalaryComponentToAnEmployee);
router.get('/employees/me/salary_components/:id', auth, readASalaryComponentOfMine);
router.get('/employees/:emp_id/salary_components/:id', isAdmin, readASalaryComponentOfAnEmployee);
router.get('/employees/me/salary_components', auth, readMyAllSalaryComponents);
router.get('/employees/:emp_id/salary_components', isAdmin, readAllSalaryComponentsOfAnEmployee);
router.patch('/employees/:emp_id/salary_components/:id', isAdmin, updateASalaryComponentOfAnEmployee);
router.delete('/employees/:emp_id/salary_components', isAdmin, deleteSalaryComponentsOfAnEmployee);

router.post('/employees/me/work_experiences', auth, addMyWorkExperience);
router.post('/employees/:emp_id/work_experiences', supervisorOrAdmin, addAWorkExperienceForAnEmployee);
router.get('/employees/me/work_experiences/:id', auth, getAWorkExperienceOfMine);
router.get('/employees/:emp_id/work_experiences/:id', supervisorOrAdmin, readAWorkExperienceOfAnEmployee);
router.get('/employees/me/work_experiences', auth, realMyAllWorkExperiences);
router.get('/employees/:emp_id/work_experiences', supervisorOrAdmin, realAllWorkExperiencesOfMine);
router.patch('/employees/me/work_experiences/:id', auth, updateMyWorkExperience);
router.patch('/employees/:emp_id/work_experiences/:id', supervisorOrAdmin, updateAWorkExperienceOfAnEmployee);
router.delete('/employees/me/work_experiences', auth, deleteMyWorkExperiences);
router.delete('/employees/:emp_id/work_experiences', supervisorOrAdmin, deleteWorkExperiencesOfAnEmployee);

router.post('/employees/me/education', auth, addMyEducation);
router.post('/employees/:emp_id/education', supervisorOrAdmin, addEducationOfAnEmployee);
router.get('/employees/me/education/:id', auth, readMyEducation);
router.get('/employees/:emp_id/education/:id', supervisorOrAdmin, readEducationOfAnEmployee);
router.get('/employees/me/education', auth, readMyAllEducation);
router.get('/employees/:emp_id/education', supervisorOrAdmin, readAllEducationOfAnEmployee);
router.patch('/employees/me/education/:id', auth, updateEducationOfMine);
router.patch('/employees/:emp_id/education/:id', supervisorOrAdmin, updateEducationOfAnEmployee);
router.delete('/employees/me/education', auth, deleteMyEducations);
router.delete('/employees/:emp_id/education', supervisorOrAdmin, deleteEducationsOfAnEmployee);

router.post('/employees/me/skills', auth, addMySkill);
router.post('/employees/:emp_id/skills', supervisorOrAdmin, addASkillToAnEmployee);
router.get('/employees/me/skills/:id', auth, getMySkill);
router.get('/employees/:emp_id/skills/:id', supervisorOrAdmin, readASkillOfAnEmployee);
router.get('/employees/me/skills', auth, readMyAllSkills);
router.get('/employees/:emp_id/skills', supervisorOrAdmin, readAllSkillsOfAnEmployee);
router.patch('/employees/me/skills/:id', auth, updateMySkill);
router.patch('/employees/:emp_id/skills/:id', supervisorOrAdmin, updateASkillOfAnEmployee);
router.delete('/employees/me/skills', auth, deleteMySkills);
router.delete('/employees/:emp_id/skills', supervisorOrAdmin, deleteSkillsOfAnEmployee);

router.post('/employees/me/languages', auth, addMyLanguage);
router.post('/employees/:emp_id/languages', supervisorOrAdmin, addALanguageOfAnEmployee);
router.get('/employees/me/languages/:id', auth, readMyLanguage);
router.get('/employees/:emp_id/languages/:id', supervisorOrAdmin, readALanguageOfAnEmployee);
router.get('/employees/me/languages', auth, readMyAllLanguages);
router.get('/employees/:emp_id/languages', supervisorOrAdmin, readAllLanguagesOfAnEmployee);
router.patch('/employees/me/languages/:id', auth, updateMyLanguage);
router.patch('/employees/:emp_id/languages/:id', supervisorOrAdmin, updateALanguageOfAnEmployee);
router.delete('/employees/me/languages', auth, deleteMyLanguages);
router.delete('/employees/:emp_id/languages', supervisorOrAdmin, deleteLanguagesOfAnEmployee);

router.post('/employees/me/licenses', auth, addMyLicense);
router.post('/employees/:emp_id/licenses', supervisorOrAdmin, addALicenseOfAnEmployee);
router.get('/employees/me/licenses/:id', auth, readMyLicense);
router.get('/employees/:emp_id/licenses/:id', supervisorOrAdmin, readALicenseOfAnEmployee);
router.get('/employees/me/licenses', auth, getMyAllLicenses);
router.get('/employees/:emp_id/licenses', supervisorOrAdmin, readAllLicensesOfAnEmployee);
router.patch('/employees/me/licenses/:id', auth, updateMyLicense);
router.patch('/employees/:emp_id/licenses/:id', supervisorOrAdmin, updateALicenseOfAnEmployee);
router.delete('/employees/me/licenses', auth, deleteMyLicenses);
router.delete('/employees/:emp_id/licenses', supervisorOrAdmin, deleteLicensesOfAnEmployee);

router.post('/employees/me/memberships', auth, addMyMembership);
router.post('/employees/:emp_id/memberships', supervisorOrAdmin, addAMembershipToAnEmployee);
router.get('/employees/me/memberships/:id', auth, readMyMembership);
router.get('/employees/:emp_id/memberships/:id', supervisorOrAdmin, readAMembershipOfAnEmployee);
router.get('/employees/me/memberships', auth, readAllMyMemberships);
router.get('/employees/:emp_id/memberships', supervisorOrAdmin, readAllMembershipsOfAnEmployee);
router.patch('/employees/me/memberships/:id', auth, updateMyMembership);
router.patch('/employees/:emp_id/memberships/:id', supervisorOrAdmin, updateAMembershipOfAnEmployee);
router.delete('/employees/me/memberships', auth, deleteMyMemberships);
router.delete('/employees/:emp_id/memberships', supervisorOrAdmin, deleteMembershipsOfAnEmployee);

router.post('/employees/me/:screen/attachments', auth, attachmentUpload.single('attachment'), addMyAttachment, error);
router.post('/employees/:emp_id/:screen/attachments', supervisorOrAdmin, attachmentUpload.single('attachment'), addAnAttachmentOfEmployee, error);
router.get('/employees/me/:screen/attachments/:id', auth, readMyAttachment);
router.get('/employees/:emp_id/:screen/attachments/:id', supervisorOrAdmin, readAnAttachmentOfAnEmployee);
router.get('/employees/me/:screen/attachments', auth, readAllMyAttachmentsForAScreen);
router.get('/employees/:emp_id/:screen/attachments', supervisorOrAdmin, readAllAttachmentsOfAScreenForAnEmployee);
router.patch('/employees/me/:screen/attachments/:id', auth, attachmentUpload.single('attachment'), updateMyAttachment);
router.patch('/employees/:emp_id/:screen/attachments/:id', supervisorOrAdmin, attachmentUpload.single('attachment'), updateAttachmentOfAnEmployee);
router.delete('/employees/me/:screen/attachments', auth, deleteMyAttachments);
router.delete('/employees/:emp_id/:screen/attachments', supervisorOrAdmin, deleteAttachmentsOfAnEmployee);
module.exports = router;