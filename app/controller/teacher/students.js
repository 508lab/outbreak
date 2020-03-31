'use strict';

const TeacherBaseController = require('../base/teacher');
const ErrMsg = require('../../global/errmsg');
const ClasDepartment = require('../../global/clasdepartment');

/**
 * 教师系统中关于学生的操作
 */
class StudentController extends TeacherBaseController {

    /**
     * 学生信息
     */
    async students() {
        const { ctx } = this;
        const id = ctx.session.teacherid;
        const user = await ctx.service.teacher.findById(id);
        let classs = ClasDepartment[user.department];
        let clas = classs[0];
        if (ctx.query.clas) {
            clas = ctx.query.clas;
        }
        const data = await ctx.service.students.findClasData(user.department, clas);
        await ctx.render('teacher/students.ejs', {
            clas: classs,
            data: data
        });
    }

    /**
     * 修改学生密码
     */
    async cpass() {
        const { ctx } = this;
        let res = await ctx.service.students.updatePassword(ctx.request.body.studentid, '123456');
        if (res) {
            ctx.body = { code: 1 };
        } else {
            ctx.body = { code: 0, err: ErrMsg[4] };
        }
    }

    /**
     * 编辑学生信息
     */
    async edit() {
        const { ctx } = this;
        const { user, id } = ctx.request.body;
        let res = await ctx.service.students.edit(id, user);
        if (res) {
            ctx.body = { code: 1 };
        } else {
            ctx.body = { code: 0, err: ErrMsg[4] };
        }
    }

    /**
     * 对学生的操作
     */
    async student() {
        const { ctx } = this;
        const METHOD = ctx.request.method;
        if (METHOD == 'GET') {
            await ctx.render('/teacher/studentadd.ejs');
        } else if (METHOD == 'POST') {
            const user = ctx.request.body;
            if (await ctx.service.students.findByStudentId(ctx.request.body.studentid)) {
                ctx.body = { code: 0, err: ErrMsg[2] };
                return;
            }
            user.password = '123456';
            if (await ctx.service.students.insert(user)) {
                ctx.body = { code: 1 };
            } else {
                ctx.body = { code: 0, err: ErrMsg[6] };
            }
        } else if (METHOD == 'DELETE') {
            const sid = ctx.request.body.sid;
            if (await ctx.service.students.delete(sid)) {
                ctx.body = { code: 1 };
            } else {
                ctx.body = { code: 0, err: ErrMsg[5] };
            }
        }
    }

    /**
     * 教师管理学生文章
     */
    async article() {
        const { ctx } = this;
        const METHOD = ctx.request.method;
        if (METHOD == 'GET') {
            await ctx.render('/teacher/article.ejs');
        } else if (METHOD == 'PUT') {
            let { id, audit, sid } = ctx.request.body;
            if (await ctx.service.article.editByTeacher(sid, id, { audit: audit })) {
                ctx.body = { code: 1 };
            } else {
                ctx.body = { code: 0, err: ErrMsg[4] };
            }
        } else if (METHOD == 'DELETE') {
            let { id, sid } = ctx.request.body;
            if (await ctx.service.article.delete(id, sid)) {
                ctx.body = { code: 1 };
            } else {
                ctx.body = { code: 0, err: ErrMsg[5] };
            }
        }
    }
    /**
     * 文章列表
     */
    async list() {
        const { ctx } = this;
        let req = ctx.request.query;
        const data = await ctx.service.article.alllist({}, parseInt(req.length), parseInt(req.start));
        const len = await ctx.service.article.count();
        ctx.body = {
            draw: req.draw, start: req.start, length: req.length, recordsTotal: data.length,
            recordsFiltered: len[0]['count(*)'], data: data
        };
    }
}

module.exports = StudentController;
