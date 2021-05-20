const express = require('express');
const isAdmin = require('../../../middleware/admin');
const auth = require('../../../middleware/auth');

const {addChat,readAllChats} = require('../controllers/chat');
const router = new express.Router();


router.post('/profilePic', addChat);
router.get('/profilePic',readAllChats);

// router.get('/skills/:id', auth, readChat);

module.exports = router;