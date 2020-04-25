'use strict';

const TeacherBaseController = require('../base/teacher');
const ErrMsg = require('../../global/errmsg');
const Tool = require('../../global/tool');
const SendEmail = require('../../global/email');

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
        const clasDep = await Tool.getClassDepData();
        let classs = clasDep[user.department];
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
            await ctx.render('/teacher/articles/article.ejs', {
                tags: await Tool.getArticleTags()
            });
        } else if (METHOD == 'PUT') { //审核文章
            let { id, audit, sid } = ctx.request.body;
            if (await ctx.service.article.editByTeacher(sid, id, { audit: audit }) && await this.ctx.helper.emailStatus()) {
                let str_email = '未通过';
                if (audit == 1) {
                    str_email = '通过';
                }
                try {
                    let ele = await ctx.service.students.findColoumById(sid, ['email']);
                    if (ele.email) {
                        await SendEmail(ele.email, '文章申核通知', '文章申核', `您有文章申核${str_email}`);
                    }
                } catch (error) {
                    ctx.logger.error(error);
                } finally {
                    ctx.body = { code: 1 };
                }
            } else {
                ctx.body = { code: 0, err: ErrMsg[4] };
            }
        } else if (METHOD == 'DELETE') {  //删除文章
            let { id, sid } = ctx.request.body;
            if (await ctx.service.article.delete(id, sid) && await this.ctx.helper.emailStatus()) {
                try {
                    let ele = await ctx.service.students.findColoumById(sid, ['email']);
                    if (ele.email) {
                        await SendEmail(ele.email, '文章删除通知', '文章删除', `您有文章被管理员删除。`);
                    }
                } catch (error) {
                    ctx.logger.error(error);
                } finally {
                    ctx.body = { code: 1 };
                }
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
            recordsFiltered: len, data: data,
        };
    }

    /**
     * 评论管理
     */
    async comments() {
        const { ctx } = this;
        const METHOD = ctx.request.method;
        if (METHOD == 'GET') {
            await ctx.render('/teacher/articles/comments.ejs');
        } else if (METHOD == 'DELETE') {
            let { id, sid } = ctx.request.body;
            if (await ctx.service.comments.delete({ id: id }) && await this.ctx.helper.emailStatus()) {
                try {
                    let ele = await ctx.service.students.findColoumById(sid, ['email']);
                    if (ele.email) {
                        await SendEmail(ele.email, '文章删除通知', '文章删除', `您有文章被管理员删除。`);
                    }
                } catch (error) {
                    ctx.logger.error(error);
                } finally {
                    ctx.body = { code: 1 };
                }
            } else {
                ctx.body = { code: 0, err: ErrMsg[5] };
            }
        }
    }

    /**
     * 评论列表
     */
    async commentslist() {
        const { ctx } = this;
        let req = ctx.request.query;
        const data = await ctx.service.comments.alllist({}, parseInt(req.length), parseInt(req.start));
        const len = await ctx.service.comments.count();
        ctx.body = {
            draw: req.draw, start: req.start, length: req.length, recordsTotal: data.length,
            recordsFiltered: len, data: data,
        };
    }

}

module.exports = StudentController;
