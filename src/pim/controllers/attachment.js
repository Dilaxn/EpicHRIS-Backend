const {Attachment} = require('../models/attachment');

const addAnAttachment = async (req, res, employee_id) => {
    try {
        if (!req.file) {
            res.status(400).send({message: 'file not found'});
            return;
        }

        const keys = Object.keys(req.body);
        if (keys.length > 1) {
            res.status(400).send({message: 'invalid keys attached with body'});
            return;
        }

        if (keys.length === 1) {
            if (keys[0] !== 'description') {
                res.status(400).send({message: 'invalid request'});
                return;
            }
        }

        const attachment = new Attachment({
            file: req.file.buffer,
            file_name: req.file.originalname,
            size: req.file.size,
            mime_type: req.file.mimetype,
            screen: req.params.screen,
            added_by: req.user.employee,
            employee: employee_id,
            ...req.body
        });
        await attachment.save();
        await attachment.populate({
            path: 'added_by',
            select: 'first_name last_name'
        }).execPopulate();
        const final = attachment.toObject();
        delete final.file;
        delete final.__v;
        delete final.id;
        delete final.added_by.id;

        res.status(201).send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}
const addMyAttachment = async (req, res) => {
    await addAnAttachment(req, res, req.user.employee);
}

const addAnAttachmentOfEmployee = async (req, res) => {
    await addAnAttachment(req, res, req.params.emp_id);
}

const readAnAttachment = async (req, res, employee_id) => {
    try {
        const attachment = await Attachment.findOne({
            employee: employee_id,
            screen: req.params.screen,
            _id: req.params.id
        });
        // const attachment = await Attachment.findById(req.params.id);
        if (!attachment) {
            res.status(404).send({message: 'file not found'});
            return;
        }

        const inlineContentDisposition = ['image/jpeg', 'application/pdf', 'image/png', 'text/html',
            'image/svg+xml', 'image/gif', 'audio/mpeg', 'audio/vorbis', 'text/plain', 'video/mp4'];

        res.set('Content-Type', attachment.mime_type);
        if (!inlineContentDisposition.includes(attachment.mime_type)) {
            res.set('Content-Disposition', 'attachment; filename=' + attachment.file_name);
        }
        res.send(attachment.file)


    } catch (e) {
        res.status(500).send(e);
    }
}

const readMyAttachment = async (req, res) => {
    await readAnAttachment(req, res, req.user.employee);
}

const readAnAttachmentOfAnEmployee = async (req, res) => {
    await readAnAttachment(req, res, req.params.emp_id);
}

const readAllAttachmentsForAScreen = async (req, res, employee_id) => {
    try {
        const attachments = await Attachment.find({employee: employee_id, screen: req.params.screen}).populate({
            path: 'added_by modified_by',
            select: 'first_name last_name'
        }).select('-file -__v');

        if (!attachments || attachments.length === 0) {
            res.status(404).send({message: 'not found'});
            return;
        }

        const final = [];

        attachments.forEach((attachment) => {
            const obj = attachment.toObject();
            delete obj.id;
            delete obj.added_by.id;

            if (obj.modified_by) {
                delete obj.modified_by.id;
            }
            final.push(obj);
        })

        res.send(final);

    } catch (e) {
        res.status(500).send(e);
    }
}


const readAllMyAttachmentsForAScreen = async (req, res) => {
    await readAllAttachmentsForAScreen(req, res, req.user.employee);
}

const readAllAttachmentsOfAScreenForAnEmployee = async (req, res) => {
    await readAllAttachmentsForAScreen(req, res, req.params.emp_id);
}

const updateAnAttachment = async (req, res, employee_id) => {
    try {
        const updates = Object.keys(req.body);
        if (updates.length > 1) {
            res.status(400).send({message: 'invalid request sent'});
            return;
        }

        if (updates.length === 1) {
            if (updates[0] !== 'description') {
                res.status(400).send({message: 'field should be \'description\''});
                return;
            }
        }

        const attachment = await Attachment.findOne({
            employee: employee_id,
            screen: req.params.screen,
            _id: req.params.id
        });
        if (!attachment) {
            res.status(404).send({message: 'attachment not found'});
            return;
        }
        if (req.file) {
            attachment.file = req.file.buffer;
            attachment.file_name = req.file.originalname;
            attachment.size = req.file.size;
            attachment.mime_type = req.file.mimetype;
        }

        if (updates.includes('description')) {
            attachment.description = req.body.description;
        }

        attachment.modified_date = Date.now();
        attachment.modified_by = req.user.employee;

        await attachment.save();
        await attachment.populate({
            path: 'added_by modified_by',
            select: 'first_name last_name'
        }).execPopulate();
        const final = attachment.toObject();
        delete final.file;
        delete final.__v;
        delete final.id;
        delete final.added_by.id;
        delete final.modified_by.id;

        res.send(final);

    } catch (e) {
        res.status(500).send(e);
    }
}

const updateMyAttachment = async (req, res) => {
    await updateAnAttachment(req, res, req.user.employee);
}

const updateAttachmentOfAnEmployee = async (req, res) => {
    await updateAnAttachment(req, res, req.params.emp_id);
}

const deleteAttachments = async (req, res, employee_id) => {
    try {
        const ids = req.body.attachments;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        const final = [];
        for (const id of ids) {
            const attachment = await Attachment.findOne({employee: employee_id, screen: req.params.screen, _id: id});
            if (attachment) {
                await attachment.remove();
                const obj = attachment.toObject();
                delete obj.__v;
                delete obj.id;
                delete obj.file;
                final.push(obj);
            }
        }

        if (final.length === 0) {
            res.status(404).send({message: 'none found'});
            return;
        }

        res.send(final);
    } catch (e) {
        res.status(500).send(e);
    }
}


const deleteMyAttachments = async (req, res) => {
    await deleteAttachments(req, res, req.user.employee);
}

const deleteAttachmentsOfAnEmployee = async (req, res) => {
    await deleteAttachments(req, res, req.params.emp_id);
}

module.exports = {
    addMyAttachment,
    addAnAttachmentOfEmployee,
    readMyAttachment,
    readAnAttachmentOfAnEmployee,
    readAllMyAttachmentsForAScreen,
    readAllAttachmentsOfAScreenForAnEmployee,
    updateMyAttachment,
    updateAttachmentOfAnEmployee,
    deleteMyAttachments,
    deleteAttachmentsOfAnEmployee
}