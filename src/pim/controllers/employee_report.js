const {EmployeeReport} = require('../models/employee_report');
const {getOptionalFields} = require('../controllers/employee');
const {CustomField} = require('../models/custom_field');
const {Employee} = require('../models/employee');

const generateNestedObject = (obj, keyPath, value) => {
    const lastKeyIndex = keyPath.length - 1;
    for (let i = 0; i < lastKeyIndex; ++i) {
        let key = keyPath[i];
        if (!(key in obj)) {
            obj[key] = {}
        }
        obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
}

const getAllowedReportFields = async () => {
    const optionalFields = await getOptionalFields();
    const allowedOptionalKeys = [];
    optionalFields.forEach((optionalField) => {
        allowedOptionalKeys.push('display_groups-personal-'.concat(optionalField));
    })

    const personalCustomKeys = await CustomField.getCustomFieldsName('personal');
    const allowedPersonalCustomKeys = [];
    personalCustomKeys.forEach((personalCustomKey) => {
        allowedPersonalCustomKeys.push('display_groups-personal-custom_fields-'.concat(personalCustomKey));
    })

    const contactCustomKeys = await CustomField.getCustomFieldsName('contact');
    const allowedContactCustomKeys = [];
    contactCustomKeys.forEach((contactCustomKey) => {
        allowedContactCustomKeys.push('display_groups-contact-custom_fields-'.concat(contactCustomKey));
    })

    const emergencyContactCustomKeys = await CustomField.getCustomFieldsName('emergency_contact');
    const allowedEmergencyContactCustomKeys = [];
    emergencyContactCustomKeys.forEach((emergencyContactCustomKey) => {
        allowedEmergencyContactCustomKeys.push('display_groups-emergency_contact-custom_fields-'.concat(emergencyContactCustomKey));
    })

    const dependentCustomKeys = await CustomField.getCustomFieldsName('dependent');
    const allowedDependentCustomKeys = [];
    dependentCustomKeys.forEach((dependentCustomKey) => {
        allowedDependentCustomKeys.push('display_groups-dependent-custom_fields-'.concat(dependentCustomKey));
    })

    const membershipCustomKeys = await CustomField.getCustomFieldsName('membership');
    const allowedMembershipCustomKeys = [];
    membershipCustomKeys.forEach((membershipCustomKey) => {
        allowedMembershipCustomKeys.push('display_groups-membership-custom_fields-'.concat(membershipCustomKey));
    })

    const workExperienceCustomKeys = await CustomField.getCustomFieldsName('work_experience');
    const allowedWorkExperienceCustomKeys = [];
    workExperienceCustomKeys.forEach((workExperienceCustomKey) => {
        allowedWorkExperienceCustomKeys.push('display_groups-work_experience-custom_fields-'.concat(workExperienceCustomKey));
    })

    const educationCustomKeys = await CustomField.getCustomFieldsName('education');
    const allowedEducationCustomKeys = [];
    educationCustomKeys.forEach((educationCustomKey) => {
        allowedEducationCustomKeys.push('display_groups-education-custom_fields-'.concat(educationCustomKey));
    })

    const skillCustomKeys = await CustomField.getCustomFieldsName('skill');
    const allowedSkillCustomKeys = [];
    skillCustomKeys.forEach((skillCustomKey) => {
        allowedSkillCustomKeys.push('display_groups-skill-custom_fields-'.concat(skillCustomKey));
    })

    const languageCustomKeys = await CustomField.getCustomFieldsName('language');
    const allowedLanguageCustomKeys = [];
    languageCustomKeys.forEach((languageCustomKey) => {
        allowedLanguageCustomKeys.push('display_groups-language-custom_fields-'.concat(languageCustomKey));
    })

    const licenseCustomKeys = await CustomField.getCustomFieldsName('license');
    const allowedLicenseCustomKeys = [];
    licenseCustomKeys.forEach((licenseCustomKey) => {
        allowedLicenseCustomKeys.push('display_groups-license-custom_fields-'.concat(licenseCustomKey));
    })

    const reportToCustomKeys = await CustomField.getCustomFieldsName('report_to');
    const allowedSupervisorCustomKeys = [];
    reportToCustomKeys.forEach((reportToCustomKey) => {
        allowedSupervisorCustomKeys.push('display_groups-supervisor-custom_fields-'.concat(reportToCustomKey));
    })

    const allowedSubordinateCustomKeys = [];
    reportToCustomKeys.forEach((reportToCustomKey) => {
        allowedSubordinateCustomKeys.push('display_groups-subordinate-custom_fields-'.concat(reportToCustomKey));
    })

    const salaryCustomKeys = await CustomField.getCustomFieldsName('salary');
    const allowedSalaryCustomKeys = [];
    salaryCustomKeys.forEach((salaryCustomKey) => {
        allowedSalaryCustomKeys.push('display_groups-salary-custom_fields-'.concat(salaryCustomKey));
    })

    const jobCustomKeys = await CustomField.getCustomFieldsName('job');
    const allowedJobCustomKeys = [];
    jobCustomKeys.forEach((jobCustomKey) => {
        allowedJobCustomKeys.push('display_groups-job-custom_fields-'.concat(jobCustomKey));
    })

    const immigrationCustomKeys = await CustomField.getCustomFieldsName('immigration');
    const allowedImmigrationCustomKeys = [];
    immigrationCustomKeys.forEach((immigrationCustomKey) => {
        allowedImmigrationCustomKeys.push('display_groups-immigration-custom_fields-'.concat(immigrationCustomKey));
    })

    return ['report_name', 'selected_criteria-include', 'selected_criteria-employee_name', 'selected_criteria-pay_grade',
        'selected_criteria-education', 'selected_criteria-employment_status', 'selected_criteria-service_period-select_by',
        'selected_criteria-service_period-year_one', 'selected_criteria-service_period-year_two', 'selected_criteria-joined_date-select_by',
        'selected_criteria-joined_date-first_date', 'selected_criteria-joined_date-second_date', 'selected_criteria-job_title', 'selected_criteria-language',
        'selected_criteria-skill', 'selected_criteria-age_group-select_by', 'selected_criteria-age_group-min_age', 'selected_criteria-age_group-max_age',
        'selected_criteria-sub_unit', 'selected_criteria-gender', 'selected_criteria-location', 'display_groups-personal-first_name',
        'display_groups-personal-middle_name', 'display_groups-personal-last_name', 'display_groups-personal-employee_id', 'display_groups-personal-nic',
        'display_groups-personal-gender', 'display_groups-personal-marital_status', 'display_groups-personal-nationality', 'display_groups-personal-data_of_birth',
        'display_groups-personal-driving_license_no', 'display_groups-personal-license_expiry_date', ...allowedOptionalKeys, ...allowedPersonalCustomKeys,
        'display_groups-contact-street1', 'display_groups-contact-street2', 'display_groups-contact-city', 'display_groups-contact-province',
        'display_groups-contact-country', 'display_groups-contact-locale', 'display_groups-contact-postal_code', 'display_groups-contact-home_tel',
        'display_groups-contact-mobile', 'display_groups-contact-work_tel', 'display_groups-contact-work_email', 'display_groups-contact-other_email',
        ...allowedContactCustomKeys, 'display_groups-emergency_contact-name', 'display_groups-emergency_contact-relationship',
        'display_groups-emergency_contact-home_tel', 'display_groups-emergency_contact-mobile', 'display_groups-emergency_contact-work_tel',
        ...allowedEmergencyContactCustomKeys, 'display_groups-dependent-name', 'display_groups-dependent-relationship', 'display_groups-dependent-data_of_birth',
        ...allowedDependentCustomKeys, 'display_groups-membership-membership', 'display_groups-membership-subscription_paid_by',
        'display_groups-membership-subscription_amount', 'display_groups-membership-currency', 'display_groups-membership-commence_date',
        'display_groups-membership-renewal_date', ...allowedMembershipCustomKeys, 'display_groups-work_experience-company',
        'display_groups-work_experience-title_of_job', 'display_groups-work_experience-from', 'display_groups-work_experience-to',
        'display_groups-work_experience-comment', ...allowedWorkExperienceCustomKeys, 'display_groups-education-level', 'display_groups-education-institute',
        'display_groups-education-specialization', 'display_groups-education-gpa', 'display_groups-education-start_date', 'display_groups-education-end_date',
        'display_groups-education-year', ...allowedEducationCustomKeys, 'display_groups-skill-skill', 'display_groups-skill-years_of_experience',
        'display_groups-skill-comment', ...allowedSkillCustomKeys, 'display_groups-language-language', 'display_groups-language-fluency',
        'display_groups-language-competency', 'display_groups-language-comment', ...allowedLanguageCustomKeys, 'display_groups-license-license_type',
        'display_groups-license-license_number', 'display_groups-license-issued_date', 'display_groups-license-expiry_date', ...allowedLicenseCustomKeys,
        'display_groups-supervisor-employee_id', 'display_groups-supervisor-first_name', 'display_groups-supervisor-last_name', 'display_groups-supervisor-reporting_method',
        ...allowedSupervisorCustomKeys, 'display_groups-subordinate-employee_id', 'display_groups-subordinate-first_name', 'display_groups-subordinate-last_name',
        'display_groups-subordinate-reporting_method', ...allowedSubordinateCustomKeys, 'display_groups-salary-pay_grade', 'display_groups-salary-salary_component',
        'display_groups-salary-pay_frequency', 'display_groups-salary-currency', 'display_groups-salary-amount', 'display_groups-salary-comment',
        'display_groups-salary-deposit_detail-account_number', 'display_groups-salary-deposit_detail-account_type', 'display_groups-salary-deposit_detail-routing_number',
        'display_groups-salary-deposit_detail-amount', ...allowedSalaryCustomKeys, 'display_groups-job-job_title', 'display_groups-job-employment_status',
        'display_groups-job-job_category', 'display_groups-job-joined_date', 'display_groups-job-sub_unit', 'display_groups-job-location',
        'display_groups-job-contract-start_date', 'display_groups-job-contract-end_date', 'display_groups-job-termination_reason',
        'display_groups-job-termination_date', 'display_groups-job-termination_note', ...allowedJobCustomKeys, 'display_groups-immigration-document',
        'display_groups-immigration-issued_by', 'display_groups-immigration-number', 'display_groups-immigration-issued_date',
        'display_groups-immigration-expiry_date', 'display_groups-immigration-eligible_status', 'display_groups-immigration-eligible_review_date',
        'display_groups-immigration-comment', ...allowedImmigrationCustomKeys];
}

const checkValidKeys = (keys, allowedKeys) => {
    return keys.every((key) => {
        return allowedKeys.includes(key);
    });
}

const defineAReport = async (req, res) => {
    try {
        const keys = Object.keys(req.body);
        const allowedKeys = await getAllowedReportFields();
        const isValidOperation = checkValidKeys(keys, allowedKeys);

        if (!isValidOperation) {
            res.status(400).send({message: 'invalid request you made'});
            return;
        }

        let employeeReportObj = {};
        let filteredKeys = keys;

        if (keys.includes('selected_criteria-employee_name')) {
            if (typeof req.body['selected_criteria-employee_name'] === 'string') {
                const lowerCaseFullName = req.body['selected_criteria-employee_name'].toLowerCase();
                const nameArray = lowerCaseFullName.split(/\s/g);
                const filteredNameArray = nameArray.filter((name) => {
                    return name !== '';
                })

                if (filteredNameArray.length === 1) {
                    employeeReportObj.selected_criteria = {};
                    employeeReportObj.selected_criteria.employee_name = {};
                    employeeReportObj.selected_criteria.employee_name.first = filteredNameArray[0];
                }

                if (filteredNameArray.length === 2) {
                    employeeReportObj.selected_criteria = {};
                    employeeReportObj.selected_criteria.employee_name = {};
                    employeeReportObj.selected_criteria.employee_name.first = filteredNameArray[0];
                    employeeReportObj.selected_criteria.employee_name.last = filteredNameArray[1];
                }

                if (filteredNameArray.length > 2) {
                    employeeReportObj.selected_criteria = {};
                    employeeReportObj.selected_criteria.employee_name = {};
                    employeeReportObj.selected_criteria.employee_name.first = filteredNameArray[0];
                    employeeReportObj.selected_criteria.employee_name.middle = filteredNameArray[1];
                    employeeReportObj.selected_criteria.employee_name.last = filteredNameArray[2];
                }
            }

            filteredKeys = keys.filter((key) => {
                return key !== 'selected_criteria-employee_name';
            })
        }

        filteredKeys.forEach((filteredKey) => {
            const arr = filteredKey.split('-');
            generateNestedObject(employeeReportObj, arr, req.body[filteredKey]);
        });

        const employeeReport = new EmployeeReport(employeeReportObj);
        await employeeReport.save();
        await employeeReport.populate({
            path: 'selected_criteria.pay_grade selected_criteria.education selected_criteria.employment_status selected_criteria.job_title ' +
                'selected_criteria.language selected_criteria.skill selected_criteria.sub_unit selected_criteria.location',
            select: 'name job_title job_specification.fileName job_description code native_name description unit_id level ' +
                'province city address postal_code phone fax notes',
            options: {
                autopopulate: false
            },
            populate: {
                path: 'country locale',
                select: 'name code local location'
            }
        }).execPopulate();
        const final = employeeReport.toObject();
        if (final.selected_criteria) {
            if (final.selected_criteria.pay_grade) {
                delete final.selected_criteria.pay_grade.id;
            }
        }
        if (final.selected_criteria) {
            if (final.selected_criteria.location) {
                delete final.selected_criteria.location.id;
            }
        }
        delete final.id;
        delete final.__v;
        res.status(201).send(final)
    } catch (e) {
        res.status(500).send({error: e.message});
    }
}

const readAllDefinedReports = async (req, res) => {
    try {
        const reports = await EmployeeReport.find({}).populate({
            path: 'selected_criteria.pay_grade selected_criteria.education selected_criteria.employment_status selected_criteria.job_title ' +
                'selected_criteria.language selected_criteria.skill selected_criteria.sub_unit selected_criteria.location',
            select: 'name job_title job_specification.fileName job_description code native_name description unit_id level ' +
                'province city address postal_code phone fax notes',
            options: {
                autopopulate: false
            },
            populate: {
                path: 'country locale',
                select: 'name code local location'
            }
        }).select('-__v');

        if (!reports || reports.length === 0) {
            res.status(404).send({message: 'no reports found'});
            return;
        }

        const final = [];
        reports.forEach((report) => {
            const obj = report.toObject();
            delete obj.id;
            if (obj.selected_criteria) {
                if (obj.selected_criteria.pay_grade) {
                    delete obj.selected_criteria.pay_grade.id;
                }
            }
            if (obj.selected_criteria) {
                if (obj.selected_criteria.location) {
                    delete obj.selected_criteria.location.id;
                }
            }
            final.push(obj);
        })

        if (final.length === 0) {
            res.status(404).send({message: 'none found'});
            return;
        }
        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const updateADefinedReport = async (req, res) => {
    try {
        const keys = Object.keys(req.body);
        const allowedKeys = await getAllowedReportFields();

        const isValidOperation = checkValidKeys(keys, allowedKeys);

        if (!isValidOperation) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        let employeeReportObj = {};
        let filteredKeys = keys;

        if (keys.includes('selected_criteria-employee_name')) {
            if (typeof req.body['selected_criteria-employee_name'] === 'string') {
                const lowerCaseFullName = req.body['selected_criteria-employee_name'].toLowerCase();
                const nameArray = lowerCaseFullName.split(/\s/g);
                const filteredNameArray = nameArray.filter((name) => {
                    return name !== '';
                })

                if (filteredNameArray.length === 1) {
                    employeeReportObj.selected_criteria = {};
                    employeeReportObj.selected_criteria.employee_name = {};
                    employeeReportObj.selected_criteria.employee_name.first = filteredNameArray[0];
                }

                if (filteredNameArray.length === 2) {
                    employeeReportObj.selected_criteria = {};
                    employeeReportObj.selected_criteria.employee_name = {};
                    employeeReportObj.selected_criteria.employee_name.first = filteredNameArray[0];
                    employeeReportObj.selected_criteria.employee_name.last = filteredNameArray[1];
                }

                if (filteredNameArray.length > 2) {
                    employeeReportObj.selected_criteria = {};
                    employeeReportObj.selected_criteria.employee_name = {};
                    employeeReportObj.selected_criteria.employee_name.first = filteredNameArray[0];
                    employeeReportObj.selected_criteria.employee_name.middle = filteredNameArray[1];
                    employeeReportObj.selected_criteria.employee_name.last = filteredNameArray[2];
                }
            }

            filteredKeys = keys.filter((key) => {
                return key !== 'selected_criteria-employee_name';
            })
        }

        filteredKeys.forEach((filteredKey) => {
            const arr = filteredKey.split('-');
            generateNestedObject(employeeReportObj, arr, req.body[filteredKey]);
        });

        const updated = await EmployeeReport.findByIdAndUpdate(req.params.id, employeeReportObj, {
            new: true,
            useFindAndModify: false
        }).populate({
            path: 'selected_criteria.pay_grade selected_criteria.education selected_criteria.employment_status selected_criteria.job_title ' +
                'selected_criteria.language selected_criteria.skill selected_criteria.sub_unit selected_criteria.location',
            select: 'name job_title job_specification.fileName job_description code native_name description unit_id level ' +
                'province city address postal_code phone fax notes',
            options: {
                autopopulate: false
            },
            populate: {
                path: 'country locale',
                select: 'name code local location'
            }
        }).select('-__v');
        if (!updated) {
            res.status(404).send({message: 'report not found'});
            return;
        }

        const final = updated.toObject();
        delete final.id;
        if (final.selected_criteria) {
            if (final.selected_criteria.pay_grade) {
                delete final.selected_criteria.pay_grade.id;
            }
        }

        if (final.selected_criteria) {
            if (final.selected_criteria.location) {
                delete final.selected_criteria.location.id;
            }
        }
        res.send(final);
    } catch (e) {
        res.status(500).send({error: e.message});
    }
}

const deleteDefinedReports = async (req, res) => {
    try {
        const ids = req.body.reports;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const final = [];
        for (const id of ids) {
            const report = await EmployeeReport.findById(id).select('-__v');
            if (report) {
                await report.remove();
                const obj = report.toObject();
                delete obj.id;
                final.push(obj);
            }
        }

        if (final.length === 0) {
            res.status(404).send({message: 'none deleted'});
            return;
        }

        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}

const runAReport = async (req, res) => {
    try {
        const report = await EmployeeReport.findById(req.params.id);
        if (!report) {
            res.status(404).send({message: 'not found'});
            return;
        }


        const employees = await Employee.find({}).lean().populate({
            path: 'termination contact emergency_contacts supervisors dependents immigrations job salary_components ' +
                'educations skills languages licenses memberships work_experiences',
            select: '-__v -contract.detail',
            populate: {
                path: 'country locale supervisor method issued_by job_title job_category sub_unit location employment_status ' +
                    'pay_grade pay_frequency currency level skill language fluency competency ' +
                    'license_type membership reason',
                select: '-__v -middle_name -driving_license_no -license_expiry_date -gender' +
                    '-marital_status -date_of_birth -job_specification',
                options: {
                    autopopulate: false
                },
                populate: {
                    path: 'country locale currency_type',
                    select: '-__v'
                }
            }
        }).select('-__v');


        if (!employees || employees.length === 0) {
            res.status(404).send({message: 'not found employees'});
            return;
        }

        let firstFilteredArray = employees;
        if (report.selected_criteria.include === 'currentonly') {
            firstFilteredArray = employees.filter((employee) => {
                return employee.termination.length === 0 || !employee.termination;
            })
        }

        if (report.selected_criteria.include === 'pastonly') {
            firstFilteredArray = employees.filter((employee) => {
                return employee.termination.length > 0;
            })
        }

        let secondFilteredArray = firstFilteredArray;
        if (report.selected_criteria.employee_name.first) {
            secondFilteredArray = firstFilteredArray.filter((employee) => {
                return employee.first_name === report.selected_criteria.employee_name.first;
            })
        }

        let thirdFilteredArray = secondFilteredArray;
        if (report.selected_criteria.employee_name.middle) {
            thirdFilteredArray = secondFilteredArray.filter((employee) => {
                return employee.middle_name === report.selected_criteria.employee_name.middle;
            })
        }

        let fourthFilteredArray = thirdFilteredArray;
        if (report.selected_criteria.employee_name.last) {
            fourthFilteredArray = thirdFilteredArray.filter((employee) => {
                return employee.last_name === report.selected_criteria.employee_name.last;
            })
        }

        let fifthFilteredArray = fourthFilteredArray;
        if (report.selected_criteria.pay_grade) {
            fifthFilteredArray = fourthFilteredArray.filter((employee) => {
                if (employee.salary_components.length > 0) {
                    for (const salaryComponent of employee.salary_components) {
                        if (salaryComponent.pay_grade._id.toString() === report.selected_criteria.pay_grade.toString()) {
                            return true;
                        }
                    }
                    return false;
                }

                return false;
            })
        }

        let sixthFilteredArray = fifthFilteredArray;
        if (report.selected_criteria.education) {
            sixthFilteredArray = fifthFilteredArray.filter((employee) => {
                if (employee.educations.length > 0) {
                    for (const education of employee.educations) {
                        if (education.level._id.toString() === report.selected_criteria.education.toString()) {
                            return true;
                        }
                    }
                    return false;
                }

                return false;
            })
        }

        let seventhFilteredArray = sixthFilteredArray;
        if (report.selected_criteria.employment_status) {
            seventhFilteredArray = sixthFilteredArray.filter((employee) => {
                if (employee.job.length > 0) {
                    if (employee.job[0].employment_status) {
                        return employee.job[0].employment_status._id.toString() === report.selected_criteria.employment_status.toString();
                    }
                    return false;
                }

                return false;
            })
        }

        let eighthFilteredArray = seventhFilteredArray;
        if (report.selected_criteria.service_period.year_one) {
            if (report.selected_criteria.service_period.select_by === 'lessthan') {
                eighthFilteredArray = seventhFilteredArray.filter((employee) => {
                    if (employee.job[0]) {
                        if (employee.job[0].joined_date) {
                            if ((new Date().getTime() - employee.job[0].joined_date.getTime()) < report.selected_criteria.service_period.year_one * 3.154e+10) {
                                return true;
                            }
                        }
                    }
                })

            } else if (report.selected_criteria.service_period.select_by === 'greaterthan') {
                eighthFilteredArray = seventhFilteredArray.filter((employee) => {
                    if (employee.job[0]) {
                        if (employee.job[0].joined_date) {
                            if ((new Date().getTime() - employee.job[0].joined_date.getTime()) > report.selected_criteria.service_period.year_one * 3.154e+10) {
                                return true;
                            }
                        }
                    }
                })

            } else if (report.selected_criteria.service_period.select_by === 'range' && report.selected_criteria.service_period.year_two) {
                eighthFilteredArray = seventhFilteredArray.filter((employee) => {
                    if (employee.job[0]) {
                        if (employee.job[0].joined_date) {
                            if ((new Date().getTime() - employee.job[0].joined_date.getTime()) > report.selected_criteria.service_period.year_one * 3.154e+10 && (new Date().getTime() - employee.job[0].joined_date.getTime()) < report.selected_criteria.service_period.year_two * 3.154e+10) {
                                return true;
                            }
                        }
                    }
                })
            }
        }

        let ninthFilteredArray = eighthFilteredArray;
        if (report.selected_criteria.joined_date.first_date) {
            if (report.selected_criteria.joined_date.select_by === 'after') {
                ninthFilteredArray = eighthFilteredArray.filter((employee) => {
                    if (employee.job[0]) {
                        if (employee.job[0].joined_date) {
                            if (employee.job[0].joined_date.getTime() > report.selected_criteria.joined_date.first_date.getTime()) {
                                return true;
                            }
                        }
                    }
                })
            } else if (report.selected_criteria.joined_date.select_by === 'before') {
                ninthFilteredArray = eighthFilteredArray.filter((employee) => {
                    if (employee.job[0]) {
                        if (employee.job[0].joined_date) {
                            if (employee.job[0].joined_date.getTime() < report.selected_criteria.joined_date.first_date.getTime()) {
                                return true;
                            }
                        }
                    }
                })
            } else if (report.selected_criteria.joined_date.select_by === 'between' && report.selected_criteria.joined_date.second_date) {
                ninthFilteredArray = eighthFilteredArray.filter((employee) => {
                    if (employee.job[0]) {
                        if (employee.job[0].joined_date) {
                            if (employee.job[0].joined_date.getTime() > report.selected_criteria.joined_date.first_date.getTime() && employee.job[0].joined_date.getTime() < report.selected_criteria.joined_date.second_date.getTime()) {
                                return true;
                            }
                        }
                    }
                })
            }
        }

        let tenthFilteredArray = ninthFilteredArray;
        if (report.selected_criteria.job_title) {
            tenthFilteredArray = ninthFilteredArray.filter((employee) => {
                if (employee.job[0]) {
                    if (employee.job[0].job_title) {
                        if (employee.job[0].job_title._id.toString() === report.selected_criteria.job_title.toString()) {
                            return true;
                        }
                    }
                }
            })
        }

        let eleventhFilteredArray = tenthFilteredArray;
        if (report.selected_criteria.language) {
            eleventhFilteredArray = tenthFilteredArray.filter((employee) => {
                if (employee.languages.length > 0) {
                    let isExist = false;
                    for (let i = 0; i < employee.languages.length; i++) {
                        if (employee.languages[i].language._id.toString() === report.selected_criteria.language.toString()) {
                            isExist = true;
                            break;
                        }
                    }

                    return isExist;
                }
            })
        }

        let twelveFilteredArray = eleventhFilteredArray;
        if (report.selected_criteria.skill) {
            twelveFilteredArray = eleventhFilteredArray.filter((employee) => {
                if (employee.skills.length > 0) {
                    let isExist = false;
                    for (let i = 0; i < employee.skills.length; i++) {
                        if (employee.skills[i].skill._id.toString() === report.selected_criteria.skill.toString()) {
                            isExist = true;
                            break;
                        }
                    }

                    return isExist;
                }
            })
        }

        let thirteenthFilteredArray = twelveFilteredArray;
        if (report.selected_criteria.age_group.min_age) {
            if (report.selected_criteria.age_group.select_by === 'lessthan') {
                thirteenthFilteredArray = twelveFilteredArray.filter((employee) => {
                    if (employee.date_of_birth) {
                        if (new Date().getTime() - employee.date_of_birth.getTime() < report.selected_criteria.age_group.min_age * 3.154e+10) {
                            return true;
                        }
                    }
                })
            } else if (report.selected_criteria.age_group.select_by === 'greaterthan') {
                thirteenthFilteredArray = twelveFilteredArray.filter((employee) => {
                    if (employee.date_of_birth) {
                        if (new Date().getTime() - employee.date_of_birth.getTime() > report.selected_criteria.age_group.min_age * 3.154e+10) {
                            return true;
                        }
                    }
                })
            } else if (report.selected_criteria.age_group.select_by === 'range' && report.selected_criteria.age_group.max_age) {
                thirteenthFilteredArray = twelveFilteredArray.filter((employee) => {
                    if (employee.date_of_birth) {
                        const ageInMilliSeconds = new Date().getTime() - employee.date_of_birth.getTime();
                        const minAge = report.selected_criteria.age_group.min_age * 3.154e+10;
                        const maxAge = report.selected_criteria.age_group.max_age * 3.154e+10;
                        if (ageInMilliSeconds > minAge && ageInMilliSeconds < maxAge) {
                            return true;
                        }
                    }
                })
            }
        }

        let fourteenthFilteredArray = thirteenthFilteredArray;
        if (report.selected_criteria.sub_unit) {
            fourteenthFilteredArray = thirteenthFilteredArray.filter((employee) => {
                if (employee.job[0]) {
                    if (employee.job[0].sub_unit) {
                        if (employee.job[0].sub_unit._id.toString() === report.selected_criteria.sub_unit.toString()) {
                            return true;
                        }
                    }
                }
            })
        }

        let fifteenthFilteredArray = fourteenthFilteredArray;
        if (report.selected_criteria.gender === 'male') {
            fifteenthFilteredArray = fourteenthFilteredArray.filter((employee) => {
                if (employee.gender) {
                    if (employee.gender === 'male') {
                        return true;
                    }
                }
            })
        } else if (report.selected_criteria.gender === 'female') {
            fifteenthFilteredArray = fourteenthFilteredArray.filter((employee) => {
                if (employee.gender) {
                    if (employee.gender === 'female') {
                        return true;
                    }
                }
            })
        }

        let sixteenthFilteredArray = fifteenthFilteredArray;
        if (report.selected_criteria.location) {
            sixteenthFilteredArray = fifteenthFilteredArray.filter((employee) => {
                if (employee.job[0]) {
                    if (employee.job[0].location) {
                        if (employee.job[0].location._id.toString() === report.selected_criteria.location.toString()) {
                            return true;
                        }
                    }
                }
            })
        }

        const personalFields = Object.keys(report.display_groups.personal).filter((personalField) => {
            return personalField !== '$init' && personalField !== 'custom_fields'
        });
        const personalCustomFields = Object.keys(report.display_groups.personal.custom_fields);
        const deletedPersonalFields = personalFields.filter((personalField) => {
            return !report.display_groups.personal[personalField]
        });
        const deletedPersonalCustomFields = personalCustomFields.filter((personalCustomField) => {
            return !report.display_groups.personal.custom_fields[personalCustomField];
        });

        const contactFields = Object.keys(report.display_groups.contact).filter((contactField) => {
            return contactField !== 'custom_fields' && contactField !== '$init';
        });
        const contactCustomFields = Object.keys(report.display_groups.contact.custom_fields);
        const deletedContactFields = contactFields.filter((contactField) => {
            return !report.display_groups.contact[contactField];
        });
        const deletedContactCustomFields = contactCustomFields.filter((contactCustomField) => {
            return !report.display_groups.contact.custom_fields[contactCustomField];
        })

        const dependentFields = Object.keys(report.display_groups.dependent).filter((dependentField) => {
            return dependentField !== '$init' && dependentField !== 'custom_fields';
        });
        const dependentCustomFields = Object.keys(report.display_groups.dependent.custom_fields);
        const deletedDependentFields = dependentFields.filter((dependentField) => {
            return !report.display_groups.dependent[dependentField];
        })
        const deletedDependentCustomFields = dependentCustomFields.filter((dependentCustomField) => {
            return !report.display_groups.dependent.custom_fields[dependentCustomField];
        })

        const membershipFields = Object.keys(report.display_groups.membership).filter((membershipField) => {
            return membershipField !== '$init' && membershipField !== 'custom_fields';
        });
        const membershipCustomFields = Object.keys(report.display_groups.membership.custom_fields);
        const deletedMembershipFields = membershipFields.filter((membershipField) => {
            return !report.display_groups.membership[membershipField];
        });
        const deletedMembershipCustomFields = membershipCustomFields.filter((membershipCustomField) => {
            return !report.display_groups.membership.custom_fields[membershipCustomField];
        })

        const workExperienceFields = Object.keys(report.display_groups.work_experience).filter((workExperienceField) => {
            return workExperienceField !== '$init' && workExperienceField !== 'custom_fields';
        });
        const workExperienceCustomFields = Object.keys(report.display_groups.work_experience.custom_fields);
        const deletedWorkExperienceFields = workExperienceFields.filter((workExperienceField) => {
            return !report.display_groups.work_experience[workExperienceField];
        });
        const deletedWorkExperienceCustomFields = workExperienceCustomFields.filter((workExperienceCustomField) => {
            return !report.display_groups.work_experience.custom_fields[workExperienceCustomField];
        })

        const educationFields = Object.keys(report.display_groups.education).filter((educationField) => {
            return educationField !== '$init' && educationField !== 'custom_fields';
        });
        const educationCustomFields = Object.keys(report.display_groups.education.custom_fields);
        const deletedEducationFields = educationFields.filter((educationField) => {
            return !report.display_groups.education[educationField];
        });
        const deletedEducationCustomFields = educationCustomFields.filter((educationCustomField) => {
            return !report.display_groups.education.custom_fields[educationCustomField];
        })

        const skillFields = Object.keys(report.display_groups.skill).filter((skillField) => {
            return skillField !== '$init' && skillField !== 'custom_fields';
        });
        const skillCustomFields = Object.keys(report.display_groups.skill.custom_fields);
        const deletedSkillFields = skillFields.filter((skillField) => {
            return !report.display_groups.skill[skillField];
        });
        const deletedSkillCustomFields = skillCustomFields.filter((skillCustomField) => {
            return !report.display_groups.skill.custom_fields[skillCustomField];
        });

        const languageFields = Object.keys(report.display_groups.language).filter((languageField) => {
            return languageField !== '$init' && languageField !== 'custom_fields';
        });
        const languageCustomFields = Object.keys(report.display_groups.language.custom_fields);
        const deletedLanguageFields = languageFields.filter((languageField) => {
            return !report.display_groups.language[languageField];
        });
        const deletedLanguageCustomFields = languageCustomFields.filter((languageCustomField) => {
            return !report.display_groups.language.custom_fields[languageCustomField];
        });

        const licenseFields = Object.keys(report.display_groups.license).filter((licenseField) => {
            return licenseField !== '$init' && licenseField !== 'custom_fields';
        });
        const licenseCustomFields = Object.keys(report.display_groups.license.custom_fields);
        const deletedLicenseFields = licenseFields.filter((licenseField) => {
            return !report.display_groups.license[licenseField];
        });
        const deletedLicenseCustomFields = licenseCustomFields.filter((licenseCustomField) => {
            return !report.display_groups.license.custom_fields[licenseCustomField];
        });

        const supervisorFields = Object.keys(report.display_groups.supervisor).filter((supervisorField) => {
            return supervisorField !== '$init' && supervisorField !== 'custom_fields' && supervisorField !== 'reporting_method';
        });
        const supervisorCustomFields = Object.keys(report.display_groups.supervisor.custom_fields);
        const allowedSupervisorFields = supervisorFields.filter((supervisorField) => {
            return report.display_groups.supervisor[supervisorField];
        });
        allowedSupervisorFields.push('_id');
        const deletedSupervisorCustomFields = supervisorCustomFields.filter((supervisorCustomField) => {
            return !report.display_groups.supervisor.custom_fields[supervisorCustomField];
        });
        const displayReportingMethodOfSupervisor = report.display_groups.supervisor.reporting_method;

        const subordinateFields = Object.keys(report.display_groups.subordinate).filter((subordinateField) => {
            return subordinateField !== '$init' && subordinateField !== 'custom_fields' && subordinateField !== 'reporting_method';
        });
        const subordinateCustomFields = Object.keys(report.display_groups.subordinate.custom_fields);
        const allowedSubordinateFields = subordinateFields.filter((subordinateField) => {
            return report.display_groups.subordinate[subordinateField];
        });
        allowedSubordinateFields.push('_id');
        const deletedSubordinateCustomFields = subordinateCustomFields.filter((subordinateCustomField) => {
            return !report.display_groups.subordinate.custom_fields[subordinateCustomField];
        });
        const displayReportingMethodOfSubordinate = report.display_groups.subordinate.reporting_method;

        const salaryFields = Object.keys(report.display_groups.salary).filter((salaryField) => {
            return salaryField !== '$init' && salaryField !== 'custom_fields' && salaryField !== 'deposit_detail';
        });
        const depositDetailFields = Object.keys(report.display_groups.salary.deposit_detail).filter((depositDetailField) => {
            return depositDetailField !== '$init';
        });
        const salaryCustomFields = Object.keys(report.display_groups.salary.custom_fields);
        const deletedSalaryFields = salaryFields.filter((salaryField) => {
            return !report.display_groups.salary[salaryField];
        });
        const deletedDepositDetailFields = depositDetailFields.filter((depositDetailField) => {
            return !report.display_groups.salary.deposit_detail[depositDetailField];
        })
        const deletedSalaryCustomFields = salaryCustomFields.filter((salaryCustomField) => {
            return !report.display_groups.salary.custom_fields[salaryCustomField];
        });

        const jobFields = ['job_title', 'employment_status', 'job_category', 'joined_date', 'sub_unit',
            'location'];
        const contractFields = ['start_date', 'end_date'];
        const terminationFields = ['termination_reason', 'termination_date', 'termination_note'];
        const jobCustomFields = Object.keys(report.display_groups.job.custom_fields);
        const deletedJobFields = jobFields.filter((jobField) => {
            return !report.display_groups.job[jobField];
        })
        const deletedContractFields = contractFields.filter((contractField) => {
            return !report.display_groups.job.contract[contractField];
        })
        const deletedJobCustomFields = jobCustomFields.filter((jobCustomField) => {
            return !report.display_groups.job.custom_fields[jobCustomField];
        })
        const deletedTerminationFields = terminationFields.filter((terminationField) => {
            return !report.display_groups.job[terminationField];
        });
        const finalTerminationKeysToDel = [];
        deletedTerminationFields.forEach((key) => {
            let finalKey = key.split('_')[1];
            finalTerminationKeysToDel.push(finalKey)
        });

        const immigrationFields = Object.keys(report.display_groups.immigration).filter((immigrationField) => {
            return immigrationField !== '$init' && immigrationField !== 'custom_fields';
        });
        const immigrationCustomFields = Object.keys(report.display_groups.immigration.custom_fields);
        const deletedImmigrationFields = immigrationFields.filter((immigrationField) => {
            return !report.display_groups.immigration[immigrationField];
        });
        const deletedImmigrationCustomFields = immigrationCustomFields.filter((immigrationCustomField) => {
            return !report.display_groups.immigration.custom_fields[immigrationCustomField];
        });

        for (const employee of sixteenthFilteredArray) {
            for (const deletedPersonalField of deletedPersonalFields) {
                delete employee[deletedPersonalField];
            }
            if (employee.custom_fields) {
                for (const deletedPersonalCustomField of deletedPersonalCustomFields) {
                    delete employee.custom_fields[deletedPersonalCustomField];
                }
            }

            if (employee.contact[0]) {
                for (const deletedContactField of deletedContactFields) {
                    delete employee.contact[0][deletedContactField];
                }

                for (const deletedContactCustomField of deletedContactCustomFields) {
                    if (employee.contact[0].custom_fields) {
                        delete employee.contact[0].custom_fields[deletedContactCustomField];
                    }
                }
                delete employee.contact[0].employee;
            }

            if (employee.dependents.length > 0) {
                for (const dependent of employee.dependents) {
                    for (const deletedDependentField of deletedDependentFields) {
                        delete dependent[deletedDependentField];
                    }

                    for (const deletedDependentCustomField of deletedDependentCustomFields) {
                        if (dependent.custom_fields) {
                            delete dependent.custom_fields[deletedDependentCustomField];
                        }
                    }

                    delete dependent.employee;
                }
            }

            if (employee.memberships.length > 0) {
                for (const membership of employee.memberships) {
                    for (const deletedMembershipField of deletedMembershipFields) {
                        delete membership[deletedMembershipField];
                    }
                    if (membership.custom_fields) {
                        for (const deletedMembershipCustomField of deletedMembershipCustomFields) {
                            delete membership.custom_fields[deletedMembershipCustomField];
                        }
                    }

                    delete membership.employee;
                }
            }

            if (employee.work_experiences.length > 0) {
                for (const workExperience of employee.work_experiences) {
                    for (const deletedWorkExperienceField of deletedWorkExperienceFields) {
                        delete workExperience[deletedWorkExperienceField];
                    }

                    if (workExperience.custom_fields) {
                        for (const deletedWorkExperienceCustomField of deletedWorkExperienceCustomFields) {
                            delete workExperience.custom_fields[deletedWorkExperienceCustomField];
                        }
                    }

                    delete workExperience.employee;
                }
            }

            if (employee.educations.length > 0) {
                for (const education of employee.educations) {
                    for (const deletedEducationField of deletedEducationFields) {
                        delete education[deletedEducationField];
                    }

                    if (education.custom_fields) {
                        for (const deletedEducationCustomField of deletedEducationCustomFields) {
                            delete education.custom_fields[deletedEducationCustomField];
                        }
                    }

                    delete education.employee;
                }
            }

            if (employee.skills.length > 0) {
                for (const skill of employee.skills) {
                    for (const deletedSkillField of deletedSkillFields) {
                        delete skill[deletedSkillField];
                    }

                    if (skill.custom_fields) {
                        for (const deletedSkillCustomField of deletedSkillCustomFields) {
                            delete skill.custom_fields[deletedSkillCustomField];
                        }
                    }

                    delete skill.employee;
                }
            }

            if (employee.skills.length > 0) {
                for (const skill of employee.skills) {
                    for (const deletedSkillField of deletedSkillFields) {
                        delete skill[deletedSkillField];
                    }

                    if (skill.custom_fields) {
                        for (const deletedSkillCustomField of deletedSkillCustomFields) {
                            delete skill.custom_fields[deletedSkillCustomField];
                        }
                    }

                    delete skill.employee;
                }
            }

            if (employee.languages.length > 0) {
                for (const language of employee.languages) {
                    for (const deletedLanguageField of deletedLanguageFields) {
                        delete language[deletedLanguageField];
                    }

                    if (language.custom_fields) {
                        for (const deletedLanguageCustomField of deletedLanguageCustomFields) {
                            delete language.custom_fields[deletedLanguageCustomField];
                        }
                    }

                    delete language.employee;
                }
            }

            if (employee.licenses.length > 0) {
                for (const license of employee.licenses) {
                    for (const deletedLicenseField of deletedLicenseFields) {
                        delete license[deletedLicenseField];
                    }

                    if (license.custom_fields) {
                        for (const deletedLicenseCustomField of deletedLicenseCustomFields) {
                            delete license.custom_fields[deletedLicenseCustomField];
                        }
                    }

                    delete license.employee;
                }
            }

            if (employee.supervisors.length > 0) {
                for (const supervisor of employee.supervisors) {
                    if (!displayReportingMethodOfSupervisor) {
                        delete supervisor.method;
                    }

                    const supervisorKeys = Object.keys(supervisor.supervisor);
                    const finalDeletingSupervisorFields = supervisorKeys.filter((supervisorKey) => {
                        return !allowedSupervisorFields.includes(supervisorKey)
                    })

                    for (const deletedSupervisorField of finalDeletingSupervisorFields) {
                        delete supervisor.supervisor[deletedSupervisorField];
                    }

                    if (supervisor.custom_fields) {
                        for (const deletedSupervisorCustomField of deletedSupervisorCustomFields) {
                            delete supervisor.custom_fields[deletedSupervisorCustomField];
                        }
                    }

                    delete supervisor.subordinate;
                }
            }

            const emp = await Employee.findById(employee._id).populate({
                path: 'subordinates',
                select: '-__v',
                populate: {
                    path: 'subordinate method',
                    select: 'employee_id first_name last_name name'
                }

            }).select('subordinates');

            const empObj = emp.toObject();
            employee.subordinates = empObj.subordinates;

            if (employee.subordinates.length > 0) {
                for (const subordinate of employee.subordinates) {
                    if (!displayReportingMethodOfSubordinate) {
                        delete subordinate.method;
                    }

                    const subordinateKeys = Object.keys(subordinate.subordinate);
                    const finalDeletingSubOrdinateFields = subordinateKeys.filter((subordinateKey) => {
                        return !allowedSubordinateFields.includes(subordinateKey)
                    })

                    for (const deletedSubordinateField of finalDeletingSubOrdinateFields) {
                        delete subordinate.subordinate[deletedSubordinateField];
                    }

                    if (subordinate.custom_fields) {
                        for (const deletedSubordinateCustomField of deletedSubordinateCustomFields) {
                            delete subordinate.custom_fields[deletedSubordinateCustomField];
                        }
                    }

                    delete subordinate.supervisor;
                }
            }

            if (employee.salary_components.length > 0) {
                for (const salaryComponent of employee.salary_components) {
                    for (const deletedSalaryField of deletedSalaryFields) {
                        if (salaryComponent[deletedSalaryField]) {
                            delete salaryComponent[deletedSalaryField];
                        }
                    }
                    for (const deletedDepositDetailField of deletedDepositDetailFields) {
                        if (salaryComponent.deposit_detail) {
                            delete salaryComponent.deposit_detail[deletedDepositDetailField];
                        }
                    }
                    for (const deletedSalaryCustomField of deletedSalaryCustomFields) {
                        if (salaryComponent.custom_fields) {
                            delete salaryComponent.custom_fields[deletedSalaryCustomField];
                        }
                    }
                    delete salaryComponent.employee;
                }
            }

            if (employee.job[0]) {
                for (const deletedJobField of deletedJobFields) {
                    delete employee.job[0][deletedJobField];
                }
                for (const deletedContractField of deletedContractFields) {
                    if (employee.job[0].contract) {
                        delete employee.job[0].contract[deletedContractField];
                    }
                }
                for (const deletedJobCustomField of deletedJobCustomFields) {
                    if (employee.job[0].custom_fields) {
                        delete employee.job[0].custom_fields[deletedJobCustomField];
                    }
                }

                delete employee.job[0].employee;
                delete employee.job[0].createdAt;
                delete employee.job[0].updatedAt;
            }

            if (employee.termination.length > 0) {
                for (const finalTerminationKey of finalTerminationKeysToDel) {
                    delete employee.termination[0][finalTerminationKey];
                }

                delete employee.termination[0].employee;
            }

            if (employee.immigrations.length > 0) {
                for (const immigration of employee.immigrations) {
                    for (const deletedImmigrationField of deletedImmigrationFields) {
                        delete immigration[deletedImmigrationField];
                    }

                    if (immigration.custom_fields) {
                        for (const deletedImmigrationCustomField of deletedImmigrationCustomFields) {
                            delete immigration.custom_fields[deletedImmigrationCustomField];
                        }
                    }

                    delete immigration.employee;
                }
            }

        }

        res.send(sixteenthFilteredArray);
    } catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
    defineAReport,
    readAllDefinedReports,
    updateADefinedReport,
    deleteDefinedReports,
    runAReport,
    generateNestedObject
}