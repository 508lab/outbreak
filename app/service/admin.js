const Service = require('egg').Service;
const TABLE = "config";

/**
 * admin用户
 */
class AdminService extends Service {
    async find(data) {
        const result = await this.app.mysql.get(TABLE, data);
        return result;
    }

    async findById(id) {
        const user = await this.app.mysql.get(TABLE, { id: id });
        return user;
    }
    async changePass(id, password) {
        const row = {
            password: password
        }
        const options = {
            where: {
                id: id,
            },
        };
        const result = await this.app.mysql.update(TABLE, row, options);
        return result.affectedRows === 1;
    }
}

module.exports = AdminService;