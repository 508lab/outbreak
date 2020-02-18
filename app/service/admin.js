const Service = require('egg').Service;
const TABLE = "config";

/**
 * admin用户
 */
class AdminService extends Service {
    async find(data){
        const result = await this.app.mysql.get(TABLE, data);
        return result;
    }
}

module.exports = AdminService;