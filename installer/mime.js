const db = require('mime-db');
const {Mime} = require('../src/admin/models/mime');

const insertAllMimeTypes = async () => {
    const mimes = await Mime.find({});
    if (!mimes || mimes.length === 0) {
        const mimeTypes = Object.keys(db);
        for (const mimeType of mimeTypes) {
            const dbObj = db[mimeType];

            const allowedKeys = ['source', 'compressible', 'extensions'];
            const keys = Object.keys(dbObj);
            if (keys.includes('extensions') && dbObj.extensions.length > 0) {
                const mime = new Mime({
                    mime_type: mimeType,
                })
                allowedKeys.forEach((allowedKey) => {
                    if (keys.includes(allowedKey)) {
                        mime[allowedKey] = dbObj[allowedKey];
                    }
                })
                await mime.save();
            }
        }

        console.log('all mime types inserted successfully');
        return;
    }
    console.log('mime types already exist in the database');
}

module.exports = {
    insertAllMimeTypes
}