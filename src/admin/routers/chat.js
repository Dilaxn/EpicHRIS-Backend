const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addChat,readAllChats} = require('../controllers/chat');
const router = new express.Router();


router.post('/api/chat', addChat);
router.get('/api/chats',readAllChats);

// router.get('/api/skills/:id', auth, readChat);

module.exports = router;