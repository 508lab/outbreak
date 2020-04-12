const Service = require('egg').Service;
const TABLE = "comments";

class CommentsService extends Service {

    /**
     * 注册
     * @param {*} user 
     */
    async insert(info) {
        const result = await this.app.mysql.insert(TABLE, info);
        return result;
    }

    async getComments(where, columns) {
        return await this.app.mysql.select(TABLE, {
            where: where,
            columns: columns,
            orders: [['time', 'desc']]
        });
    }

    async delete(where) {
        const result = await this.app.mysql.delete(TABLE, where);
        return result.protocol41;
    }

}

module.exports = CommentsService;
