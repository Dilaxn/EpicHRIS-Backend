const express = require('express');
const { createUser, login, logout, logoutFromAll, readUser, queryUsers, updateUser, deleteUser, sendPasswordResetLink,
    resetMyPassword, setMyPassword} = require('../controllers/user');
const auth = require('../../../middleware/auth');
const isAdmin = require('../../../middleware/admin');
const {getUser} = require("../controllers/user");
const {readAllUsers} = require("../controllers/user");
const {readMyUserDetail} = require("../controllers/user");

const router = new express.Router();

router.post('/users',isAdmin,  createUser);
router.get('/users/:user_name/forgot_password', sendPasswordResetLink);
router.patch('/users/:password_reset_id/reset_password/:password', resetMyPassword);
router.patch('/users/:password_set_id/set_password/:password', setMyPassword);
router.post('/users/login', login);
router.post('/users/logout', auth, logout);
router.post('/users/logout_all', auth, logoutFromAll);
router.get('/users/:user_id', isAdmin, readUser);
router.get('/users', isAdmin, queryUsers);
router.patch('/users/:user_id', isAdmin, updateUser);
router.delete('/users/:user_id', isAdmin, deleteUser);
//added by me
router.get('/employees/me/user_detail', auth, readMyUserDetail );
router.get('/users', isAdmin, readAllUsers);
router.get('/users/getUser', getUser);


module.exports = router;