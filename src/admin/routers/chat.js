const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addChat,readAllChats} = require('../controllers/chat');
const router = new express.Router();


router.post('/chat', addChat);
router.get('/chats',readAllChats);

// router.get('/skills/:id', auth, readChat);

module.exports = router;