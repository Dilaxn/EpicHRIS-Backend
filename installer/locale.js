const locale = require('locale-codes');
const {Locale} = require('../src/admin/models/locale');

const insertLocales = async () => {
        const locales = await Locale.find({});

        if (!locales || locales.length === 0) {
            const localesToInsert = [];
            locale.all.forEach((locale) => {

                localesToInsert.push({
                    name: locale.name,
                    local: locale.local,
                    location: locale.location,
                    tag: locale.tag,
                    lcid: locale.lcid,
                    iso639_2: locale['iso639-2'],
                    iso639_1: locale['iso639-1']
                })
            })
            const inserted = await Locale.insertMany(localesToInsert);
            // console.log(inserted);

            if (!inserted) {
                console.log('could not inserted locales');
                return;
            }

            console.log('successfully inserted locales');
            return;
        }

        console.log('locales already exist in the data base')
}


module.exports = {
    insertLocales
}