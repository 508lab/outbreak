'use strict';

const AdminBaseontroller = require('../base/admin');
const ClasDeartment = require('../../global/clasdepartment');
const moment = require('moment');
const ErrMsg = require('../../global/errmsg');
/**
 * 管理员帐号中心（老师）
 */
class AdminTeacherController extends AdminBaseontroller {
    async index() {
        const { ctx } = this;
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

    async list() {
        const { ctx } = this;
        const list = await ctx.service.teacher.list();
        const departments = Object.keys(ClasDeartment);
        await ctx.render('/admin/teacherlist.ejs', {
            data: list,
            departments: departments,
        })
    }

    async teacher(){
        const { ctx } = this;
        const METHOD = ctx.request.method;
        if (METHOD == 'GET') {
            await ctx.render('/admin/teacheradd.ejs');
        } else if (METHOD == 'POST') { //添加教师
            const user = ctx.request.body;
            if (await ctx.service.teacher.findByStudentId(ctx.request.body.studentid)) {
                ctx.body = { code: 0, err: ErrMsg[2] };
                return;
            }
            user.password = '123456';
            if (await ctx.service.teacher.insert(user)) {
                ctx.body = { code: 1 };
            } else {
                ctx.body = { code: 0, err: ErrMsg[6] };
            }
        } else if (METHOD == 'DELETE') { //删除教师
            const sid = ctx.request.body.sid;
            if (await ctx.service.teacher.delete(sid)) {
                ctx.body = { code: 1 };
            } else {
                ctx.body = { code: 0, err: ErrMsg[5] };
            }
        } else if (METHOD == 'PUT') { //修改教师信息
            const { teacher, id } = ctx.request.body;
            let res = await ctx.service.teacher.edit(id, teacher);
            if (res) {
                ctx.body = { code: 1 };
            } else {
                ctx.body = { code: 0, err: ErrMsg[4] };
            }
        }
    }


    /**
     * 修改个人密码
     */
    async userpass() {
        const { ctx } = this;
        let res = await ctx.service.teacher.updatePassword(ctx.request.body.studentid, '123456');
        if (res) {
            ctx.body = { code: 1 };
        } else {
            ctx.body = { code: 0, err: ErrMsg[4] };
        }
    }
}

module.exports = AdminTeacherController;
