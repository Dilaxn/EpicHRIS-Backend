const jwt = require('jsonwebtoken');
const User = require('../src/admin/models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.AUTH_SECRET);
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token, status: true});
        if (!user) {
            throw new Error();
        }
        console.log("user"+user.employee)
        req.token = token;
        req.user = user;
        next();
    }catch (e) {
        res.status(401).send({ error: 'Please authenticate'});
    }
}

module.exports = auth;