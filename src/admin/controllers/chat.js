const {Chat} = require('../models/chat');


const addChat = async (req, res) => {
    try {
        console.log(req.body);
        const chat = new Chat({
            ...req.body
        });

        if (!chat) {
            res.status(400).send({message: 'invalid request'});
            return;
        }

        await chat.save();
        res.status(201).send(chat);
    }catch (e) {
        res.status(500).send(e);
    }
}


const readAllChats = async (req, res) => {
    try {
        const chats = await Chat.find({}).select('-__v');
        if (!chats) {
            res.status(404).send({message: 'countries not found'});
            return;
        }

        res.send(chats);
    }catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
   addChat,
    readAllChats
}