const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const idValidator = require('mongoose-id-validator');

const employeeReportSchema = new mongoose.Schema({
    report_name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 100
    },
    selected_criteria: {
        include: {
            type: String,
            lowercase: true,
            enum: ['currentonly', 'pastonly', 'both'],
            required: true,
            default: 'currentonly'
        },
        employee_name: {
            first: {
                type: String,
                lowercase: true,
                trim: true,
                maxlength: 20
            },
            middle: {
                type: String,
                lowercase: true,
                trim: true,
                maxlength: 20
            },
            last: {
                type: String,
                lowercase: true,
                trim: true,
                maxlength: 20
            }
        },
        pay_grade: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PayGrade'
        },
        education: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'EducationLevel'
        },
        employment_status: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'EmploymentStatus'
        },
        service_period: {
            select_by: {
                type: String,
                lowercase: true,
                enum: ['lessthan', 'greaterthan', 'range', '', null]
            },
            year_one: {
                type: Int32,
                validate(value) {
                    if (value < 0) {
                        throw new Error('years should be a positive number')
                    }
                }
            },
            year_two: {
                type: Int32,
                validate(value) {
                    if (value < 0) {
                        throw new Error('years should be a positive number')
                    }
                }
            }
        },
        joined_date: {
            select_by: {
                type: String,
                lowercase: true,
                enum: ['after', 'before', 'between', null, '']
            },
            first_date: {
                type: Date
            },
            second_date: {
                type: Date
            }
        },
        job_title: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobTitle'
        },
        language: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Language'
        },
        skill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill'
        },
        age_group: {
            select_by: {
                type: String,
                lowercase: true,
                enum: ['lessthan', 'greaterthan', 'range', null, '']
            },
            min_age: {
                type: Int32,
                validate(value) {
                    if (value < 0) {
                        throw new Error('age should be a positive number')
                    }
                }

            },
            max_age: {
                type: Int32,
                validate(value) {
                    if (value < 0) {
                        throw new Error('age should be a positive number')
                    }
                }
            }
        },
        sub_unit: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OrganizationUnit'
        },
        gender: {
            type: String,
            trim: true,
            lowercase: true,
            enum: ['male', 'female', null, ''],
        },
        location: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OrganizationLocation'
        }
    },
    display_groups: {
        personal: {
            first_name: {
                type: Boolean,
                default: false
            },
            middle_name: {
                type: Boolean,
                default: false
            },
            last_name: {
                type: Boolean,
                default: false
            },
            employee_id: {
                type: Boolean,
                default: false
            },
            nic: {
                type: Boolean,
                default: false
            },
            gender: {
                type: Boolean,
                default: false
            },
            marital_status: {
                type: Boolean,
                default: false
            },
            nationality: {
                type: Boolean,
                default: false
            },
            date_of_birth: {
                type: Boolean,
                default: false
            },
            nick_name: {
                type: Boolean,
                default: false
            },
            smoker: {
                type: Boolean,
                default: false
            },
            military_service: {
                type: Boolean,
                default: false
            },
            driving_license_no: {
                type: Boolean,
                default: false
            },
            license_expiry_date: {
                type: Boolean,
                default: false
            },
            ssn: {
                type: Boolean,
                default: false
            },
            sin: {
                type: Boolean,
                default: false
            },
            custom_fields: {}
        },
        contact: {
            street1: {
                type: Boolean,
                default: false
            },
            street2: {
                type: Boolean,
                default: false
            },
            city: {
                type: Boolean,
                default: false
            },
            province: {
                type: Boolean,
                default: false
            },
            country: {
                type: Boolean,
                default: false
            },
            locale: {
                type: Boolean,
                default: false
            },
            postal_code: {
                type: Boolean,
                default: false
            },
            home_tel: {
                type: Boolean,
                default: false
            },
            mobile: {
                type: Boolean,
                default: false
            },
            work_tel: {
                type: Boolean,
                default: false
            },
            work_email: {
                type: Boolean,
                default: false
            },
            other_email: {
                type: Boolean,
                default: false
            },
            custom_fields: {}
        },
        emergency_contact: {
            name: {
                type: Boolean,
                default: false
            },
            relationship: {
                type: Boolean,
                default: false
            },
            home_tel: {
                type: Boolean,
                default: false
            },
            mobile: {
                type: Boolean,
                default: false
            },
            work_tel: {
                type: Boolean,
                default: false
            },
            custom_fields: {}
        },
        dependent: {
            name: {
                type: Boolean,
                default: false
            },
            relationship: {
                type: Boolean,
                default: false
            },
            date_of_birth: {
                type: Boolean,
                default: false
            },
            custom_fields: {}
        },
        membership: {
            membership: {
                type: Boolean,
                default: false
            },
            subscription_paid_by: {
                type: Boolean,
                default: false
            },
            subscription_amount: {
                type: Boolean,
                default: false
            },
            currency: {
                type: Boolean,
                default: false
            },
            commence_date: {
                type: Boolean,
                default: false
            },
            renewal_date: {
                type: Boolean,
                default: false
            },
            custom_fields: {}
        },
        work_experience: {
            company: {
                type: Boolean,
                default: false
            },
            title_of_job: {
                type: Boolean,
                default: false
            },
            from: {
                type: Boolean,
                default: false
            },
            to: {
                type: Boolean,
                default: false
            },
            comment: {
                type: Boolean,
                default: false
            },
            custom_fields: {}
        },
        education: {
            level: {
                type: Boolean,
                default: false
            },
            institute: {
                type: Boolean,
                default: false
            },
            specialization: {
                type: Boolean,
                default: false
            },
            gpa: {
                type: Boolean,
                default: false
            },
            start_date: {
                type: Boolean,
                default: false
            },
            end_date: {
                type: Boolean,
                default: false
            },
            year: {
                type: Boolean,
                default: false
            },
            custom_fields: {}
        },
        skill: {
            skill: {
                type: Boolean,
                default: false
            },
            years_of_experience: {
                type: Boolean,
                default: false
            },
            comment: {
                type: Boolean,
                default: false
            },
            custom_fields: {}
        },
        language: {
            language: {
                type: Boolean,
                default: false
            },
            fluency: {
                type: Boolean,
                default: false
            },
            competency: {
                type: Boolean,
                default: false
            },
            comment: {
                type: Boolean,
                default: false
            },
            custom_fields: {}
        },
        license: {
            license_type: {
                type: Boolean,
                default: false
            },
            license_number: {
                type: Boolean,
                default: false
            },
            issued_date: {
                type: Boolean,
                default: false
            },
            expiry_date: {
                type: Boolean,
                default: false
            },
            custom_fields: {}
        },
        supervisor: {
            employee_id: {
                type: Boolean,
                default: false
            },
            first_name: {
                type: Boolean,
                default: false
            },
            last_name: {
                type: Boolean,
                default: false
            },
            reporting_method:{
                type: Boolean,
                default: false
            },
            custom_fields: {}
        },
        subordinate: {
            employee_id: {
                type: Boolean,
                default: false
            },
            first_name: {
                type: Boolean,
                default: false
            },
            last_name: {
                type: Boolean,
                default: false
            },
            reporting_method:{
                type: Boolean,
                default: false
            },
            custom_fields: {}
        },
        salary: {
            pay_grade: {
                type: Boolean,
                default: false
            },
            salary_component: {
                type: Boolean,
                default: false
            },
            pay_frequency: {
                type: Boolean,
                default: false
            },
            currency: {
                type: Boolean,
                default: false
            },
            amount: {
                type: Boolean,
                default: false
            },
            comment: {
                type: Boolean,
                default: false
            },
            deposit_detail: {
                account_number: {
                    type: Boolean,
                    default: false
                },
                account_type: {
                    type: Boolean,
                    default: false
                },
                routing_number: {
                    type: Boolean,
                    default: false
                },
                amount: {
                    type: Boolean,
                    default: false
                }
            },
            custom_fields: {},
        },
        job: {
            job_title: {
                type: Boolean,
                default: false
            },
            employment_status: {
                type: Boolean,
                default: false
            },
            job_category: {
                type: Boolean,
                default: false
            },
            joined_date: {
                type: Boolean,
                default: false
            },
            sub_unit: {
                type: Boolean,
                default: false
            },
            location: {
                type: Boolean,
                default: false
            },
            contract: {
                start_date: {
                    type: Boolean,
                    default: false
                },
                end_date: {
                    type: Boolean,
                    default: false
                }
            },
            termination_reason: {
                type: Boolean,
                default: false
            },
            termination_date: {
                type: Boolean,
                default: false
            },
            termination_note: {
                type: Boolean,
                default: false
            },
            custom_fields: {}
        },
        immigration: {
            document: {
                type: Boolean,
                default: false
            },
            issued_by: {
                type: Boolean,
                default: false
            },
            number: {
                type: Boolean,
                default: false
            },
            issued_date: {
                type: Boolean,
                default: false
            },
            expiry_date: {
                type: Boolean,
                default: false
            },
            eligible_status: {
                type: Boolean,
                default: false
            },
            eligible_review_date: {
                type: Boolean,
                default: false
            },
            comment: {
                type: Boolean,
                default: false
            },
            custom_fields: {}
        }
    }
})

employeeReportSchema.plugin(idValidator);
employeeReportSchema.set('toObject', {virtuals: true});
employeeReportSchema.set('toJSON', {virtuals: true});

employeeReportSchema.pre('save', async function (next) {
    const employeeReport = this;
    if (employeeReport.selected_criteria.service_period.select_by === 'lessthan') {
        if (!employeeReport.selected_criteria.service_period.year_one) {
            return next(new Error('year one should be inserted'));
        }
    }

    if (employeeReport.selected_criteria.service_period.select_by === 'greaterthan') {
        if (!employeeReport.selected_criteria.service_period.year_one) {
            return next(new Error('year one should be inserted'));
        }
    }

    if (employeeReport.selected_criteria.service_period.select_by === 'range') {

        if (!employeeReport.selected_criteria.service_period.year_one) {
            return next(new Error('year one should be inserted'));
        }

        if (!employeeReport.selected_criteria.service_period.year_two) {
            return next(new Error('year two should be inserted'));
        }
    }

    next();
})

const EmployeeReport = mongoose.model('EmployeeReport', employeeReportSchema);

module.exports = {
    employeeReportSchema,
    EmployeeReport
}