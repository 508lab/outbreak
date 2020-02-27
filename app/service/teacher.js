const Service = require('egg').Service;
const Tool = require('../global/tool');
const TABLE = "teacher";

/**
 * 教师
 */
class TeacherService extends Service {

    async find(info) {
        info.password = Tool.encryption(info.password);
        const user = await this.app.mysql.get(TABLE, info, {
            columns: ["id", "travel"]
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
    async updateTravel(id, data) {
        const options = {
            where: {
                id: id,
            }
        };
        const result = await this.app.mysql.update(TABLE, data, options);
        return result.affectedRows === 1;
    }
}

module.exports = TeacherService;

