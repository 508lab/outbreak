const Service = require('egg').Service;
const Tool = require('../global/tool');
const TABLE = "teacher";

/**
 * 教师
 */
class TeacherService extends Service {

    /**
     * 注册
     * @param {*} user 
     */
    async insert(user) {
        user.password = Tool.encryption(user.password);
        const result = await this.app.mysql.insert(TABLE, user);
        return result;
    }

    async find(info) {
        info.password = Tool.encryption(info.password);
        const user = await this.app.mysql.get(TABLE, info, {
            columns: ["id"]
        });
        return user;
    }

    async findById(id) {
        const user = await this.app.mysql.get(TABLE, { id: id });
        return user;
    }

    async findByStudentId(id) {
        const user = await this.app.mysql.get(TABLE, { studentid: id });
        return user;
    }

    async changePass(id, password, oldpassword) {
        password = Tool.encryption(password);
        oldpassword = Tool.encryption(oldpassword);
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

    /**
     * 更新用户的信息
     * @param {*} id 
     * @param {*} data
     */
    async updateInfo(id, data) {
        const options = {
            where: {
                id: id,
            }
        };
        const result = await this.app.mysql.update(TABLE, data, options);
        return result.affectedRows === 1;
    }

    async updatePassword(studentid, password) {
        password = Tool.encryption(password);
        const options = {
            where: {
                studentid: studentid,
            }
        };
        const result = await this.app.mysql.update(TABLE, { password: password }, options);
        return result.affectedRows === 1;
    }

    /**
     * 获取所有教师的信息
     */
    async list() {
        return await this.app.mysql.select(TABLE, {
            columns: ['name', 'sex', 'department', 'studentid', 'id'],
        });
    }

    /**
     * 修改教师信息
     * @param {*} id 
     * @param {*} info 
     */
    async edit(id, user) {
        const options = {
            where: {
                id: id,
            },
        };
        const result = await this.app.mysql.update(TABLE, user, options);
        return result.affectedRows === 1;
    }

    /**
     * 根据id删除该教师
     * @param {*} id 
     */
    async delete(id) {
        const result = await this.app.mysql.beginTransactionScope(async conn => {
            await conn.delete('teachertemp', { sid: id });
            await conn.delete(TABLE, { id: id });
            return { success: true };
        }, this.ctx);
        return result.success;
    }

    /**
     * 获取邮箱（申核文章时使用）
     */
    async randomGetEmail() {
        let sql = `SELECT email FROM ${TABLE} WHERE email IS NOT NULL ORDER BY RAND() LIMIT 1;`;
        return await this.app.mysql.query(sql);
    }

}

module.exports = TeacherService;

