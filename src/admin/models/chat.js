const mongoose = require('mongoose');

var chatSchema = mongoose.Schema({
    name: String,
    message: String,
});

var Chat = mongoose.model('Chat', chatSchema);


module.exports = {
    chatSchema,
    Chat
}