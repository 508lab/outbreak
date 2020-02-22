const Service = require('egg').Service;
const TABLE = "students";

/**
 * 所有学生的信息
 */
class StudentsService extends Service {
    async findById(id) {
        const user = await this.app.mysql.get(TABLE, { id: id });
        return user;
    }

    /**
     * 获取某个班级的人数
     * @param {*} dep
     * @param {*} clas 
     */
    async findUsersByClasDep(dep, clas) {
        return await this.app.mysql.select(TABLE, {
            where: { department: dep, clas: clas },
            columns: ['name', 'id'],
        });

    }
}

module.exports = StudentsService;