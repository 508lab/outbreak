'use strict';

const AdminBaseontroller = require('../base/admin');
const { loginin } = require('../../validate/admin');
const Tool = require('../../global/tool');
const ErrMsg = require('../../global/errmsg');


/**
 * 后台管理
 */
class AdminController extends AdminBaseontroller {
  async index() {
    const { ctx } = this;
    await ctx.render('/admin/index.ejs');
  }

  async login() {
    const { ctx } = this;
    if (ctx.session.user) {
      ctx.redirect('/admin/index');
    } else {
      await ctx.render('/admin/login.ejs');
    }
  }

  async loginin() {
    const { ctx } = this;
    let info = ctx.request.body;
    ctx.validate(loginin, info);
    const user = await ctx.service.admin.find(info);
    if (user && user.id) {
      ctx.session.user = user;
      ctx.body = { code: 1 };
    } else {
      ctx.body = { code: 0, err: ErrMsg[9] };
    }
  }

  async loginout() {
    const { ctx } = this;
    ctx.session.user = null;
    ctx.redirect('/admin/login');
  }

  /**
   * 系别管理
   */
  async clasdep(){
    const { ctx } = this;
    await ctx.render('/admin/clasdep.ejs');
  }
}

module.exports = AdminController;
