const express = require('express');
const { createUser, login, logout, logoutFromAll, readUser, queryUsers, updateUser, deleteUser, sendPasswordResetLink,
    resetMyPassword, setMyPassword} = require('../controllers/user');
const auth = require('../../../middleware/auth');
const isAdmin = require('../../../middleware/admin');
const {getUser} = require("../controllers/user");
const {readAllUsers} = require("../controllers/user");
const {readMyUserDetail} = require("../controllers/user");

const router = new express.Router();

router.post('/api/users',isAdmin,  createUser);
router.get('/api/users/:user_name/forgot_password', sendPasswordResetLink);
router.patch('/api/users/:password_reset_id/reset_password/:password', resetMyPassword);
router.patch('/api/users/:password_set_id/set_password/:password', setMyPassword);
router.post('/users/login', login);
router.post('/api/users/logout', auth, logout);
router.post('/api/users/logout_all', auth, logoutFromAll);
router.get('/api/users/:user_id', isAdmin, readUser);
router.get('/api/users', isAdmin, queryUsers);
router.patch('/api/users/:user_id', isAdmin, updateUser);
router.delete('/api/users/:user_id', isAdmin, deleteUser);
//added by me
router.get('/api/employees/me/user_detail', auth, readMyUserDetail );
router.get('/api/users', isAdmin, readAllUsers);
router.get('/api/users/getUser', getUser);


module.exports = router;