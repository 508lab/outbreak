'use strict';

const Controller = require('egg').Controller;
const { entryvalidate, logindata } = require('../validate/home');
const ErrMsg = require('../global/errmsg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('register.ejs');
  }

  /**
   * 登陆页面
   */
  async login() {
    const { ctx } = this;
    if (ctx.session.userid) {
      ctx.redirect('/info/index');
    }else{
      await ctx.render('login.ejs');
    }
  }

  /**
   * 登陆功能
   */
  async loginin() {
    const { ctx } = this;
    let info = ctx.request.body;
    ctx.validate(logindata, info);
    const user = await ctx.service.user.find(info);
    if (user && user.id) {
      ctx.session.userid = user.id;
      ctx.body = { code: 1 };
    } else {
      ctx.body = { code: 0, err: ErrMsg[9] };
    }
  }

  async loginout() {
    const { ctx } = this;
    ctx.session.userid = null;
    ctx.redirect('/login');
  }

  /**
   * 注册
   */
  async register() {
    const { ctx } = this;
    await ctx.render('register.ejs');
  }

  /**
   * 录入信息
   */
  async entry() {
    const { ctx } = this;
    const sid = ctx.query.id;
    const res = await this.validateUser(sid);
    let err = ''
    if (res === 3) {
      err = ErrMsg[18];
    }
    await ctx.render('entry.ejs', { data: res, err: err });
  }

  /**
   * 录入基本信息
   */
  async entrydata() {
    const { ctx } = this;
    let info = ctx.request.body;
    ctx.validate(entryvalidate, info);
    const res = await this.validateUser(info.studentid);
    if (res === 3) {
      ctx.body = { code: 0, err: ErrMsg[18] };
      return;
    } else {
      //比对学生库中的信息
      if (res.name != info.name || res.id != info.studentid || res.clas != info.clas || res.department != info.department) {
        ctx.body = { code: 0, err: ErrMsg[19] };
        return;
      }
      if (await ctx.service.user.findByStudentId(info.studentid)) {
        ctx.body = { code: 0, err: ErrMsg[2] }
        return;
      }
      const user = await ctx.service.user.insert(info);
      if (user.insertId) {
        ctx.session.userid = user.insertId;
        ctx.body = { code: 1 };
      } else {
        ctx.body = { code: 0, err: ErrMsg[7] };
      }
    }
  }

  /**
   * 学号对比校验
   */
  async validateUser(id) {
    let user = await this.ctx.service.students.findById(id);
    if (!user) {
      return 3;
    }
    return user;
  }
}

module.exports = HomeController;
