'use strict';

const AdminBaseontroller = require('./base');
const ClasDeartment = require('../../global/clasdepartment');
const moment = require('moment');

/**
 * 管理员帐号中心（老师）
 */
class AdminTeacherController extends AdminBaseontroller {
    async index() {
        const { ctx } = this;
        this.userv();
        const departments = Object.keys(ClasDeartment);
        const now = moment().format("YYYY-MM-DD");
        const info = ctx.query;
        let time = [now, now], department = departments[0];
        if (info.starttime && info.endtime && info.department) {
            time = [info.starttime, info.endtime]
            department = info.department;
        }

        const result = await ctx.service.teachertemp.historyByDepTime(time, department);
        await ctx.render('/admin/teacher.ejs', {
            data: result,
            departments: departments,
            department: department,
            starttime: time[0],
            endtime: time[1]
        });
    }

    /**
     * 单个老师的体温记录
     */
    async info() {
        const { ctx } = this;
        const arr = await ctx.service.teachertemp.data(ctx.query.sid);
        await ctx.render('/admin/usertmp.ejs', {
            data: arr,
            n: ctx.query.n
        });
    }


    /**
     * 修改个人密码
     */
    async userpass() {
        const { ctx } = this;
        this.userv();
        let res = await ctx.service.teacher.updatePassword(ctx.request.body.studentid, '123456');
        if (res) {
            ctx.body = { code: 1 };
        } else {
            ctx.body = { code: 0, err: ErrMsg[4] };
        }
    }
}

module.exports = AdminTeacherController;
