'use strict';

const UserInfoController = require('../base/userinfo');
const Tool = require('../../global/tool');
const { entryvalitemp, entryvalipass } = require('../../validate/user');
const ErrMsg = require('../../global/errmsg');

/**
 * 学生
 */
class UserController extends UserInfoController {

  async index() {
    const { ctx } = this;
    const data = await ctx.service.temperature.findNow(ctx.session.userid);
    await ctx.render('user/index.ejs', {
      data: data
    });
  }

  async user() {
    const { ctx } = this;
    const user = await ctx.service.students.findById(ctx.session.userid);
    await ctx.render('user/user.ejs', {
      user: user
    });
  }

  async temperature() {
    const { ctx } = this;
    const data = await ctx.service.temperature.data(ctx.session.userid);
    await ctx.render('user/temperature.ejs', {
      data: data
    });
  }

  async password() {
    const { ctx } = this;
    await ctx.render('user/password.ejs');
  }

  /**
   * 修改密码
   */
  async cpass() {
    const { ctx } = this;
    let info = ctx.request.body;
    ctx.validate(entryvalipass, info);
    const id = ctx.session.userid;
    //旧密码是否正确
    const user = await ctx.service.students.findById(id);
    if (user.password !== Tool.encryption(info.oldpassword)) {
      ctx.body = { code: 0, err: ErrMsg[16] };
      return;
    }
    if (info.password !== info.conpassword) {
      ctx.body = { code: 0, err: ErrMsg[17] };
      return;
    }
    const res = await ctx.service.students.changePass(id, info.password, info.oldpassword);
    if (res) {
      ctx.body = { code: 1 };
    } else {
      ctx.body = { code: 0, err: ErrMsg[4] };
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
    const data = await ctx.service.temperature.findNow(ctx.session.userid);
    if (data == 'undefined') {
      ctx.body = { code: 0, err: ErrMsg[15] }
      return;
    }
    const result = await ctx.service.temperature.insert({
      sid: parseInt(ctx.session.userid),
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
    await ctx.render('user/mirror.ejs');
  }
}

module.exports = UserController;
