const Service = require('egg').Service;
const TABLE = "students";

/**
 * 所有学生的信息
 */
class StudentsService extends Service {
    async findById(id) {
        const user = await this.app.mysql.get(TABLE, { id: id } );
        return user;
    }
}

module.exports = StudentsService;