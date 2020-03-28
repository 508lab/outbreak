'use strict';

const TeacherBaseController = require('../base/teacher');
const { logindata } = require('../../validate/home');
const { entryvalitemp, entryvalipass } = require('../../validate/user');
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
            const user = await ctx.service.teacher.find(info);
            if (user && user.id) {
                ctx.session.teacherid = user.id;
                ctx.body = { code: 1, data: 1 }
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
            type = ErrMsg[21];
        };
        await ctx.render('teacher/user.ejs', {
            user: user,
            deps: Object.keys(ClasDepartment),
            type: type
        });
    }

    /**
     * 更新老师的信息
     */
    async updateuser() {
        const { ctx } = this;
        const info = ctx.request.body;
        const result = await ctx.service.teacher.updateInfo(ctx.session.teacherid, info);
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

    /**
     * 对密码的操作
     */
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

    async mirror() {
        const { ctx } = this;
        await ctx.render('teacher/mirror.ejs');
    }
}

module.exports = TeacherController;
