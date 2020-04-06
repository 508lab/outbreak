const Service = require('egg').Service;
const Tool = require('../global/tool');
const fs = require('fs');
const TABLE = "students";

class StudentsService extends Service {

    /**
     * 注册
     * @param {*} user 
     */
    async insert(user) {
        user.password = Tool.encryption(user.password);
        const result = await this.app.mysql.insert(TABLE, user);
        return result;
    }

    /**
     * 登陆
     * @param {*} info 
     */
    async find(info) {
        info.password = Tool.encryption(info.password);
        const user = await this.app.mysql.get(TABLE, info, {
            columns: ["id"]
        });
        return user;
    }

    /**
     * 根据id删除该学生
     * @param {*} id 
     */
    async delete(id) {
        const articles = await this.app.mysql.select('article', { where: { sid: id } });
        const result = await this.app.mysql.beginTransactionScope(async conn => {
            await conn.delete('temperature', { sid: id });
            await conn.delete('article', { sid: id });
            await conn.delete(TABLE, { id: id });
            return { success: true };
        }, this.ctx);
        if (result.success) {
            await Tool.rmdirAsync(`${this.app.baseDir}/app/public/article/${id}/`);
        }
        return result.success;
    }

    /**
     * 重置密码
     * @param {*} studentid 
     * @param {*} password 
     */
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
     * 根据id获取学生信息
     * @param {*} id 
     */
    async findById(id) {
        const user = await this.app.mysql.get(TABLE, { id: id });
        return user;
    }

    /**
     * 根据学号获取学生信息
     * @param {*} id 
     */
    async findByStudentId(id) {
        const user = await this.app.mysql.get(TABLE, { studentid: id });
        return user;
    }

    /**
     * 修改学生密码
     * @param {*} id 
     * @param {*} password  新密码
     * @param {*} oldpassword 旧密码
     */
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
     * 获取该班级学生信息并获取当天的体温记录
     */
    async findByClas(name, department, time) {
        name = this.app.mysql.escape(name);
        department = this.app.mysql.escape(department);
        let t = 'date(t.time) = curdate()';
        if (time == 'month') {  //本月
            t = `DATE_FORMAT( t.time, '%Y%m' ) = DATE_FORMAT( CURDATE( ) , '%Y%m' )`;
        } else if (time == 'day') {  //当天
            t = 'date(t.time) = curdate()';
        } else if (time == 'week') {
            t = `YEARWEEK(date_format(t.time,'%Y-%m-%d')) = YEARWEEK(now())`;
        }
        const sql = `select * from students u join temperature t on t.sid = u.id AND department = ${department} AND clas = ${name} AND ${t};`;
        return await this.app.mysql.query(sql);
    }

    /**
     * 根据时间与班级并获取当天的体温记录
    */
    async findByClasAndTime(name, department, time) {
        name = this.app.mysql.escape(name);
        department = this.app.mysql.escape(department);
        time = this.app.mysql.escape(time);
        const sql = `select * from students u join temperature t on t.sid = u.id AND t.time = ${time} AND department = ${department} AND clas = ${name};`;
        return await this.app.mysql.query(sql);
    }

    /**
     * 找到某个班级的学生信息
     * @param {*} department 
     * @param {*} clas 
     */
    async findClasData(department, clas) {
        return await this.app.mysql.select(TABLE, {
            where: { department: department, clas: clas },
            columns: ['name', 'id', 'studentid', 'sex', 'department', 'clas'],
        });
    }

    /**
     * 获取某个班级的人数
     * @param {*} dep
     * @param {*} clas 
     */
    async findUsersByClasDep(dep, clas) {
        return await this.app.mysql.select(TABLE, {
            where: { department: dep, clas: clas },
            columns: ['name', 'studentid'],
        });
    }

    /**
     * 根据id修改学生信息
     * @param {*} id 
     * @param {*} user 
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
}

module.exports = StudentsService;

