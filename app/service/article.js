const Service = require('egg').Service;
const Tool = require('../global/tool');
const SendEmail = require('../global/email');
const TABLE = "article";

/**
 * 文章中心
 */
class ArticleService extends Service {

    /**
     * 添加
     * @param {*} user 
     */
    async insert(info) {
        info.time = new Date();
        const result = await this.app.mysql.insert(TABLE, info);
        try {
            if (result) { 
                let ele = await this.ctx.service.teacher.randomGetEmail();
                await SendEmail(ele[0].email, '新的文章需要申核', '新的文章', `<h2>文章名称：${info.title}<h2>`); 
            }
        } catch (error) {
            this.ctx.logger.error(error);
        }
        return result;
    }

    /**
     * 根据用户id获取文章信息
     * @param {*} sid   用户id  
     * @param {*} columns 
     * @param {*} orders 
     */
    async list(sid, columns = ['id', 'time', 'sid', 'audit', 'title'], orders = [['time', 'desc']]) {
        return await this.app.mysql.select(TABLE, {
            where: { sid: sid },
            columns: columns,
            orders: orders
        });
    }

    /**
     * 获取总量
     */
    async count() {
        return await this.app.mysql.count(TABLE);
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
            orders: [['audit', 'asc'], ['time', 'desc']],
            limit: limit,
            offset: offset,
        });
    }

    /**
     * 修改文章信息
     * @param {*} sid 
     * @param {*} id 
     * @param {*} info 
     */
    async edit(sid, id, info) {
        const options = {
            where: {
                id: id,
                sid: sid
            },
        };
        info.time = new Date();
        info.audit = 0; //修改文章之后需要重新审核!
        const result = await this.app.mysql.update(TABLE, info, options);
        try {
            if (result.affectedRows === 1) { 
                let ele = await this.ctx.service.teacher.randomGetEmail();
                await SendEmail(ele[0].email, '该文章被修改需要申核', '文章申核', `<h2>文章名称：${info.title}<h2>`);
            }
        } catch (error) {
            this.ctx.logger.error(error);
        }
        return result.affectedRows === 1;
    }

    /**
     * 管理员去修改文章信息
     * @param {*} sid 
     * @param {*} id 
     * @param {*} info 
     */
    async editByTeacher(sid, id, info) {
        const options = {
            where: {
                id: id,
                sid: sid
            },
        };
        const result = await this.app.mysql.update(TABLE, info, options);
        return result.affectedRows === 1;
    }

    /**
     * 根据id获取文章信息
     * @param {*} id 
     */
    async find(id) {
        return await this.app.mysql.get(TABLE, { id: id });
    }

    /**
     * 根据条件获取对应的字段
     * @param {*} where 
     */
    async findColoumByWhere(where, columns) {
        const article = await this.app.mysql.get(TABLE, where, {
            columns: columns
        });
        return article;
    }

    /**
     * 根据id获取审核通过的文章信息
     * @param {*} id 
     */
    async findByAudit(id, audit) {
        return await this.app.mysql.get(TABLE, { id: id, audit: audit });
    }

    /**
     * 根据id删除该文章
     * @param {*} id 
     * @param {*} sid 
     */
    async delete(id, sid) {
        const article = await this.app.mysql.get(TABLE, { id: id });
        const result = await this.app.mysql.beginTransactionScope(async conn => {
            await conn.delete('comments', { aid: id });
            await conn.delete(TABLE, { id: id, sid: sid });
            return { success: true };
        }, this.ctx);

        if (result.success) {
            Tool.delFile(Tool.getImgSrc(this.app.baseDir + '/app', article.content));
        }
        return result.success;
    }

    async likeQuery(q, limit) {
        q = this.app.mysql.escape(`%${q}%`);
        limit = parseInt(limit);
        let data = await this.app.mysql.query(`SELECT * from ${TABLE} WHERE audit = 1 AND(title LIKE ${q} OR content LIKE ${q}) LIMIT ${limit}`);
        return data;
    }
}


module.exports = ArticleService;