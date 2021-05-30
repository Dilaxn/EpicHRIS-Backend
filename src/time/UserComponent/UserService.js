class UserService {
    async isAdminUser(user) {
        if (user.role === 'admin') {
            return true;
        }
        return false;
    }
}
module.exports = UserService;