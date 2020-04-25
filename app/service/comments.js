const Service = require('egg').Service;
const SendEmail = require('../global/email');
const TABLE = "comments";

class CommentsService extends Service {

    /**
     * 注册
     * @param {*} user 
     */
    async insert(info) {
        const result = await this.app.mysql.insert(TABLE, info);
        try {
            if (result && await this.ctx.helper.emailStatus()) {
                let ele = await this.ctx.service.students.findColoumById(info.sid, ['email']);
                if (ele.email) {
                    let article = await this.ctx.service.article.findColoumByWhere({ id: info.aid }, ['title']);
                    await SendEmail(ele.email, '您的文章有新的评论', '评论通知', `文章：${article.title}<p></p>评论内容：${info.content}`);
                }
            }
        } catch (error) {
            this.ctx.logger.error(error);
        }
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

    /**
     * 获取数据
     * @param {*} where 
     * @param {*} limit 
     * @param {*} offset 
     */
    async alllist(where, limit = 10, offset = 0) {
        return await this.app.mysql.select(TABLE, {
            where: where,
            orders: [['time', 'desc']],
            limit: limit,
            offset: offset,
        });
    }

    /**
     * 获取总量
     */
    async count() {
        return await this.app.mysql.count(TABLE);
    }

}

module.exports = CommentsService;
