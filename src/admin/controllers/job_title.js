const {JobTitle} = require('../models/job_title');


const addAJobTitle = async (req, res) => {
    try {
        const jobTitle = new JobTitle({
            ...req.body
        });

        if (!jobTitle) {
            res.status(400).send({message: 'could not create job title'});
            return;
        }
        if (req.file) {
            jobTitle.job_specification.file = req.file.buffer;
            jobTitle.job_specification.fileName = req.file.originalname;
        }
        await jobTitle.save();
        const response = jobTitle.toObject();
        if (response.job_specification) {
            delete response.job_specification.file;
        }
        delete response.__v;
        res.status(201).send(response);
    }catch (e) {
        res.status(500).send(e);
    }

}


const readAJobTitle = async (req, res) => {
    try {
        const jobTitle = await JobTitle.findById(req.params.job_title_id).select('-job_specification.file -__v');
        if (!jobTitle) {
            res.status(404).send({message: 'not found the job title'});
            return;
        }

        res.send(jobTitle);
    }catch (e) {
        res.status(500).send(e);
    }
}

const readJobSpecification = async (req, res) => {
    try {
        const job_title = await JobTitle.findById(req.params.job_title_id).select('job_specification');

        if (!job_title || !job_title.job_specification) {
            res.status(404).send({message: 'could not found job specification document'});
            return;
        }

        res.set('Content-Type', 'application/pdf');
        res.send(job_title.job_specification.file);
    }catch (e) {
        res.status(500).send(e);
    }
}

const readAllJobTitles = async (req, res) => {
    try {
        const jobTitles = await JobTitle.find({}).select('-job_specification.file -__v');

        if (!jobTitles) {
            res.status(404).send({message: 'not found'});
            return;
        }
        else if(jobTitles.length === 0){
            res.send([]);
        }
        res.send(jobTitles);
    }catch (e) {
        res.status(500).send(e);
    }
}

const updateAJobTitle = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedKeys = ['job_title', 'job_description', 'update_job_specification', 'note'];

    const isValidOperation = updates.every((update) => {
        return allowedKeys.includes(update);
    });

    if (!isValidOperation) {
        res.status(400).send({message: 'could not update'});
        return;
    }

    try {
        const job_title = await JobTitle.findById(req.params.job_title_id);

        if (!job_title) {
            res.status(404).send({message: 'not found job title'});
            return;
        }

        let newUpdates = updates;

        if (updates.includes('update_job_specification')) {
            if (req.body.update_job_specification === 'delete') {
                job_title.job_specification.file = undefined;
                job_title.job_specification.fileName = undefined;
            }else if (req.body.update_job_specification === 'replace') {
                job_title.job_specification.file = req.file.buffer;
                job_title.job_specification.fileName = req.file.originalname;
            }

            newUpdates = updates.filter((update) => {
                return update !== 'update_job_specification';
            });
        }

        newUpdates.forEach((newUpdate) => {
            job_title[newUpdate] = req.body[newUpdate];
        })

        await job_title.save();

        const response = job_title.toObject();
        delete response.__v;
        if (response.job_specification) {
            delete response.job_specification.file;
        }


        res.send(response);


    }catch (e) {
        res.status(500).send(e);
    }
}


const deleteMultipleJobTiles = async (req, res) => {
    try {
        const jobTitles = req.body.job_titles;

        if (!jobTitles || jobTitles.length === 0 || !Array.isArray(jobTitles)) {
            res.status(400).send({message: 'could not delete'});
            return;
        }

        const response = [];

        for (const jobTitle of jobTitles) {
            const deleted = await JobTitle.findById(jobTitle).select('-job_specification -__v');

            if (deleted) {
                deleted.remove();
                response.push(deleted);
            }
        }

        if (response.length === 0) {
            res.status(404).send({message: 'non of the job title were deleted'});
            return;
        }

        res.send(response);
    }catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
    addAJobTitle,
    readAJobTitle,
    readJobSpecification,
    readAllJobTitles,
    updateAJobTitle,
    deleteMultipleJobTiles
}
