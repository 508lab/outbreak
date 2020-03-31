const Service = require('egg').Service;
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
    async count(){
        return await this.app.mysql.query(`select count(*) from ${TABLE}`);
    }

    /**
     * 获取数据
     * @param {*} where 
     * @param {*} limit 
     * @param {*} offset 
     */
    async alllist(where, limit = 10, offset = 0){
        return await this.app.mysql.select(TABLE, {
            where: where,
            orders: [['audit','asc'], ['time','desc']],
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
        return result.affectedRows === 1;
    }

    /**
     * 管理员去修改文章信息
     * @param {*} sid 
     * @param {*} id 
     * @param {*} info 
     */
    async editByTeacher(sid, id, info){
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
     * 根据id删除该文章
     * @param {*} id 
     * @param {*} sid 
     */
    async delete(id, sid) {
        //此处需要删除对应文章的图片
        const result = await this.app.mysql.delete(TABLE, {
            id: id,
            sid: sid
        });
        return result.protocol41;
    }
}


module.exports = ArticleService;