const User = require('../models/user');
const {sendOneTimePassword} = require("../../../emails/account");
const {PasswordReset} = require('../models/password_reset');
const {OneTimePassword} = require('../models/one_time_password');
const {sendPassWordResetLink} = require('../../../emails/account');
const {Employee} = require('../../pim/models/employee');

const createUser = async (req, res) => {
    const keys = Object.keys(req.body);
    const allowedKeys = ['role', 'employee', 'status', 'email'];
    const isValidOperation = keys.every((key) => {
        return allowedKeys.includes(key);
    });

    if (!isValidOperation || keys.length !== 4) {
        res.status(400).send({error: 'could not create user'});
    }

    try {
        const existingUser = await User.findOne({employee: req.body.employee});
        if (existingUser) {
            res.status(400).send({message: 'user already created'});
            return;
        }

        let userObj = {};
        keys.forEach((key) => {
            userObj[key] = req.body[key];
        })

        const employee = await Employee.findById(req.body.employee);
        if (!employee) {
            res.status(404).send({message: 'employee not found'});
            return;
        }

        userObj.user_name = employee.employee_id;
        userObj.password = Math.random().toString(36).substring(2, 9);
        const user = new User({
            ...userObj,
            employee: employee._id
        });
        await user.save();

        if (!user.status) {
            res.status(201).send({user, email_status: false});
            return;
        }

        const oneTimePassword = new OneTimePassword({
            user_id: user._id,
            emp_id: employee._id
        });

        const password = await oneTimePassword.generateOneTimePassword();
        if (!password) {
            res.status(201).send({user, email_status: false});
            return;
        }

        const resetUrl = 'https://localhost:' + process.env.PORT + '/users/' + oneTimePassword._id + '/set_password/' + password;

        const name = employee.last_name.charAt(0).toUpperCase() + employee.last_name.slice(1);
        console.log(resetUrl);
//
//         const password = await passwordReset.generateOneTimePassword();
//         const url = 'https://localhost:' + process.env.PORT + '/users/' + passwordReset._id + '/reset_password/' + password;
//         await sendPassWordResetLink(user.email, user.employee.first_name, url, user.user_name, password+":"+passwordReset._id);
//         res.send({message: 'successfully sent'})

        //
        const isSuccess = await sendOneTimePassword(user.email, name, resetUrl, user.user_name, password+":"+oneTimePassword._id);
        if (isSuccess) {
            console.log('successfully sent reset password link');
            res.status(201).send({user, email_status: true});
            return;
        }

        res.status(201).send({user, email_status: false});
    } catch (e) {
        res.status(500).send(e);
    }
};

const login = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.user_name, req.body.password);
        if (!user.status) {
            res.status(401).send('Sorry, You were terminated!! login failed!');
            return;
        }

        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e) {
        res.status(400).send({message: e.message});
    }
}

const logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })

        await req.user.save();
        res.send({message: 'you logged out'})
    } catch (e) {
        res.status(500).send(e);
    }
}

const logoutFromAll = async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.send({message: 'you logged out from all devices'})
    } catch (e) {
        res.status(500).send(e);
    }
}

const readUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id);
        await user.populate({
            path: 'employee',
            select: 'first_name last_name middle_name employee_id'
        }).execPopulate();
        if (!user) {
            res.status(404).send({message: 'not found'});
            return;
        }
        res.send(user);
    } catch (e) {
        res.status(500).send({error: e.message});
    }
}

const skipArray = (array, skip) => {
    let final = [];
    if (skip > 0 && skip <= array.length) {
        for (let i = skip; i < array.length; i++) {
            final.push(array[i]);
        }
    }else if (skip > array.length) {
        final = [];
    }else {
        final = array;
    }

    return final;
}

const limitArray = (array, limit) => {
    let final = [];
    if (limit > 0 && limit <= array.length) {
        for (let i = 0; i < limit; i++) {
            final.push(array[i]);
        }
    }else{
        final = array;
    }
    return final;
}

const queryUsers = async (req, res) => {
    try {
        const match = {};
        const sort = {};
        if (req.query.username) {
            match.user_name = req.query.username;
        }
        if (req.query.userrole) {
            match.role = req.query.userrole;
        }
        if (req.query.status) {
            match.status = req.query.status;
        }
        if (req.query.sortby) {
            const parts = req.query.sortby.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        const users = await User.find(match).lean().populate({
            path: 'employee',
            select: 'first_name middle_name last_name employee_id'
        }).select('-__v -tokens -password').sort(sort);
        if (!users) {
            res.status(404).send({message: 'not found users'});
            return;
        }

        const matchEmployee = {};
        if (req.query.employeename) {
            const lowerCaseFullName = req.query.employeename.toLowerCase();
            const nameArray = lowerCaseFullName.split(/\s/g);
            const filteredNameArray = nameArray.filter((name) => {
                return name !== '';
            })
            if (filteredNameArray.length === 1) {
                matchEmployee.first_name = filteredNameArray[0];
            }

            if (filteredNameArray.length === 2) {
                matchEmployee.first_name = filteredNameArray[0];
                matchEmployee.last_name = filteredNameArray[1];
            }

            if (filteredNameArray.length > 2) {
                matchEmployee.first_name = filteredNameArray[0];
                matchEmployee.middle_name = filteredNameArray[1];
                matchEmployee.last_name = filteredNameArray[2];
            }
        }

        let firstFilteredArray = users;
        if (matchEmployee.first_name) {
            firstFilteredArray = users.filter((user) => {
                return user.employee.first_name === matchEmployee.first_name
            })
        }

        let secondFilteredArray = firstFilteredArray;
        if (matchEmployee.last_name) {
            secondFilteredArray = firstFilteredArray.filter((user) => {
                return user.employee.last_name === matchEmployee.last_name;
            })
        }

        let thirdFilteredArray = secondFilteredArray;
        if (matchEmployee.middle_name) {
            thirdFilteredArray = secondFilteredArray.filter((user) => {
                if (user.employee.middle_name) {
                    return user.employee.middle_name === matchEmployee.middle_name;
                }
            })
        }
        const limit = parseInt(req.query.limit);
        const skip = parseInt(req.query.skip);

        const skippedArray = skipArray(thirdFilteredArray, skip);
        const limitedArray = limitArray(skippedArray, limit);


        res.send(limitedArray);
    } catch (e) {
        res.status(500).send(e.message);
    }
}

const updateUser = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedKeys = ['role', 'status'];

    const isValidOperation = updates.every((update) => {
        return allowedKeys.includes(update);
    })

    if (!isValidOperation) {
        res.status(400).send({message: 'invalid request'});
        return;
    }

    try {
        const user = await User.findById(req.params.user_id);
        if (!user) {
            res.status(404).send({message: 'user not found'});
            return;
        }

        updates.forEach((update) => {
            user[update] = req.body[update];
        })

        await user.save();
        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.user_id);
        if (!user) {
            res.status(404).send({message: 'could not delete'});
            return;
        }

        res.send(user);

    } catch (e) {
        res.status(500).send(e);
    }
}

const sendPasswordResetLink = async (req, res) => {
    try {
        const user = await User.findOne({user_name: req.params.user_name}).populate({
            path: 'employee'
        });
        if (!user) {
            res.status(404).send();
            return;
        }

        const passwordReset = new PasswordReset({
            user_id: user._id
        });

        const password = await passwordReset.generateOneTimePassword();
        const url = 'https://localhost:' + process.env.PORT + '/users/' + passwordReset._id + '/reset_password/' + password;
        await sendPassWordResetLink(user.email, user.employee.first_name, url, user.user_name, password+":"+passwordReset._id);
        res.send({message: 'successfully sent'})

    } catch (e) {
        res.status(500).send(e);
    }

}

const resetMyPassword = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedKeys = ['password'];

    const isValidOperation = updates.every((update) => {
        return allowedKeys.includes(update);
    })

    if (!isValidOperation || updates.length === 0) {
        res.status(400).send({message: 'not allowed'});
        return;
    }
    try {
        const passwordReset = await PasswordReset.findById(req.params.password_reset_id);
        if (!passwordReset) {
            res.status(400).send({message: 'not allowed'});
            return;
        }

        if (!passwordReset.password === req.params.password) {
            res.status(400).send({message: 'not allowed'});
            return
        }

        const user = await User.findById(passwordReset.user_id);
        if (!user) {
            res.status(400).send({message: 'not allowed'});
            return;
        }

        user.password = req.body.password;
        await user.save();
        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }
}

const setMyPassword = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedKeys = ['password'];

    const isValidOperation = updates.every((update) => {
        return allowedKeys.includes(update);
    })

    if (!isValidOperation || updates.length === 0) {
        res.status(400).send({message: 'not allowed'});
        return;
    }
    try {
        const oneTimePassword = await OneTimePassword.findById(req.params.password_set_id);
        if (!oneTimePassword) {
            res.status(400).send({message: 'not allowed'});
            return;
        }

        if (oneTimePassword.password !== req.params.password) {
            res.status(400).send({message: 'not allowed'});
            return
        }

        const user = await User.findById(oneTimePassword.user_id);
        if (!user) {
            res.status(400).send({message: 'not allowed'});
            return;
        }

        user.password = req.body.password;
        await user.save();
        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }
}

const readAllUsers = async (req, res) => {
    console.log("read all users");
    try {
        const users = await User.find({}).populate({
            path: 'employee',
            select: '-__v -avatar'
        }).select('-__v');
        if (!users) {
            res.status(404).send({message: 'not found users'});
            return;
        }

        res.send(users);
    } catch (e) {
        req.status(500).send(e);
    }
}

const readMyUserDetail = async (req, res) => {

    try {
        console.log("readmy Udetail")


        const user = await User.findById(req.user.id).select({ "status": 1, "_id": 1,"user_name":1,"role":1});
        if (!user) {
            res.status(404).send({message: 'not found'});
        } else {
            const final = user.toObject();
            // delete final.id;
            console.log(final)
            res.send(final);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}


const getUser= async (req, res) => {
    console.log(req.data);
    const user = await User.findByCredentials(req.body.user_name, req.body.password);
    res.json({
        displayName: user.user_name,
        id: user._id,
    });
};


module.exports = {
    createUser,
    login,
    logout,
    logoutFromAll,
    readUser,
    queryUsers,
    updateUser,
    deleteUser,
    sendPasswordResetLink,
    resetMyPassword,
    setMyPassword,
    readAllUsers,
    readMyUserDetail,
    getUser
}