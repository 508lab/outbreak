const Service = require('egg').Service;
const Tool = require('../global/tool');
const ClasDeartment = require('../global/clasdepartment');
const TABLE = "user";

class UserService extends Service {

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
     * 获取所有班级的信息
     */
    async clas() {
        let arr = [];
        for (const key in ClasDeartment) {
            if (ClasDeartment.hasOwnProperty(key)) {
                const element = ClasDeartment[key];
                arr = arr.concat({
                    clas: element,
                    dep: key,
                });
            }
        }
        return arr;
    }

    /**
     * 获取该班级学生信息并获取当天的体温记录
     */
    async findByClas(name, department, time) {
        let t = 'date(t.time) = curdate()';
        if (time == 'month') {  //本月
            t = `DATE_FORMAT( t.time, '%Y%m' ) = DATE_FORMAT( CURDATE( ) , '%Y%m' )`;
        } else if (time == 'day') {  //当天
            t = 'date(t.time) = curdate()';
        } else if (time == 'week') {
            t = `YEARWEEK(date_format(t.time,'%Y-%m-%d')) = YEARWEEK(now())`;
        }
        const sql = `select * from user u join temperature t on t.sid = u.id AND department = '${department}' AND clas = '${name}' AND ${t};`;
        return await this.app.mysql.query(sql);
    }
}

module.exports = UserService;