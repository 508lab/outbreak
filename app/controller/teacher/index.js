'use strict';

const TeacherBaseController = require('../base/teacher');
const { logindata } = require('../../validate/home');
const { entryvalitemp, entryvalipass, entryvaltravel } = require('../../validate/user');
const ErrMsg = require('../../global/errmsg');
const ClasDepartment = require('../../global/clasdepartment');
const Tool = require('../../global/tool');

class TeacherController extends TeacherBaseController {
    /**
     * 登陆页面
     */
    async login() {
        const { ctx } = this;
        if (ctx.session.teacherid) {
            ctx.redirect('/teacher/index');
        } else {
            await ctx.render('login.ejs');
        }

        if (ctx.request.method == 'GET') {
            await ctx.render('/teacher/login.ejs');
        } else {
            let info = ctx.request.body;
            ctx.validate(logindata, info);
            ctx.coreLogger.info('---teacher-login---' + JSON.stringify(info));
            const user = await ctx.service.teacher.find(info);
            if (user && user.id) {
                ctx.session.teacherid = user.id;
                if (user.travel) {  //判断是否未提交出行信息
                    ctx.body = { code: 1, data: 1 }
                } else {
                    ctx.body = { code: 1, data: 0 }
                }

            } else {
                ctx.body = { code: 0, err: ErrMsg[9] };
            }
        }
    }

    async loginout() {
        const { ctx } = this;
        ctx.session.teacherid = null;
        ctx.redirect('/teacher/login');
    }

    /**
     * 教师中心首页
     */
    async index() {
        const { ctx } = this;

        const data = await ctx.service.teachertemp.findNow(ctx.session.teacherid);
        await ctx.render('/teacher/index.ejs', {
            data: data
        });
    }

    /**
     * 个人中心
     */
    async user() {
        const { ctx } = this;

        const user = await ctx.service.teacher.findById(ctx.session.teacherid);
        let type = '';
        if (ctx.query.type) {
            type = ErrMsg[21]
        };
        if (user.travel) {
            await ctx.render('teacher/user.ejs', {
                user: user,
                travel: JSON.parse(user.travel),
                deps: Object.keys(ClasDepartment),
                type: type
            });
        } else {
            await ctx.render('teacher/user.ejs', {
                user: user,
                travel: [],
                deps: Object.keys(ClasDepartment),
                type: type
            });
        }
    }

    /**
     * 更新老师的信息
     */
    async updateuser() {
        const { ctx } = this;

        const info = ctx.request.body;
        const result = await ctx.service.teacher.updateTravel(ctx.session.teacherid, info);
        if (result) {
            ctx.body = { code: 1 };
        } else {
            ctx.body = { code: 0, err: ErrMsg[4] };
        }
    }

    async temperature() {
        const { ctx } = this;

        const data = await ctx.service.teachertemp.data(ctx.session.teacherid);
        await ctx.render('teacher/temperature.ejs', {
            data: data
        });
    }

    async password() {
        const { ctx } = this;

        if (ctx.request.method == 'GET') {
            await ctx.render('teacher/password.ejs');
        } else if (ctx.request.method == 'PUT') {
            let info = ctx.request.body;
            ctx.validate(entryvalipass, info);
            const id = ctx.session.teacherid;
            //旧密码是否正确
            const user = await ctx.service.teacher.findById(id);
            if (user.password !== Tool.encryption(info.oldpassword)) {
                ctx.body = { code: 0, err: ErrMsg[16] };
                return;
            }
            if (info.password !== info.conpassword) {
                ctx.body = { code: 0, err: ErrMsg[17] };
                return;
            }
            const res = await ctx.service.teacher.changePass(id, info.password, info.oldpassword);
            if (res) {
                ctx.body = { code: 1 };
            } else {
                ctx.body = { code: 0, err: ErrMsg[4] };
            }
        }
    }


    /**
     * 提交体温
     */
    async temp() {
        const { ctx } = this;

        let info = ctx.request.body;
        ctx.validate(entryvalitemp, info);
        let record = parseFloat(info.record);
        //校验体温数值
        if (record < 35.0 || record > 40.0) {
            ctx.body = { code: 0, err: ErrMsg[20] };
            return;
        }
        ctx.coreLogger.info('---teacher-login---' + JSON.stringify({
            id: ctx.session.teacherid,
            record: record
        }));
        //如果已经上传直接拒绝
        const data = await ctx.service.teachertemp.findNow(ctx.session.teacherid);
        if (data == 'undefined') {
            ctx.body = { code: 0, err: ErrMsg[15] }
            return;
        }

        const result = await ctx.service.teachertemp.insert({
            sid: parseInt(ctx.session.teacherid),
            record: record,
            time: new Date()
        });
        if (result.insertId) {
            ctx.body = { code: 1 };
        } else {
            ctx.body = { code: 0, err: ErrMsg[6] };
        }
    }

    async students() {
        const { ctx } = this;

        const id = ctx.session.teacherid;
        const user = await ctx.service.teacher.findById(id);
        let classs = ClasDepartment[user.department];
        let clas = classs[0];
        if (ctx.query.clas) {
            clas = ctx.query.clas;
        }
        const data = await ctx.service.user.findClasData(user.department, clas);
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

        let res = await ctx.service.user.updatePassword(ctx.request.body.studentid, '123456');
        if (res) {
            //记录修改密码的教师与学生
            ctx.coreLogger.info('---teacher-cpass-studnet---' + JSON.stringify({
                teacherid: ctx.session.teacherid,
                studentid: ctx.request.body.studentid
            }));
            ctx.body = { code: 1 };
        } else {
            ctx.body = { code: 0, err: ErrMsg[4] };
        }
    }
}

module.exports = TeacherController;
