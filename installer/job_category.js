const fs = require('fs');
const path = require('path');
const {JobCategory} = require('../src/admin/models/job_category');

const dataPath = path.join(__dirname, '../src/admin/data');

const loadJobCategoriesToDB = async () => {
    const jobCategoriesInDB = await JobCategory.find({});

    if (!jobCategoriesInDB || jobCategoriesInDB.length === 0) {
        const jobCategoriesBuffer = fs.readFileSync(dataPath + '/job_category.json');
        const jobCategoriesJSON = jobCategoriesBuffer.toString();
        const jobCategories = JSON.parse(jobCategoriesJSON);

        const updated = await JobCategory.insertMany(jobCategories);

        if (!updated || updated.length === 0) {
            console.log('could not create job categories collection');
            return;
        }

        console.log('job categories created successfully');
        return;
    }

    console.log('job categories collection already exist');
}

module.exports = {
    loadJobCategoriesToDB
}