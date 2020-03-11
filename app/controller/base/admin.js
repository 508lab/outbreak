const { Controller } = require('egg');

/**
 * 对admin进行统一验证
 */
class AdminBaseontroller extends Controller {

  constructor(app) {
    super(app);
    this.userv();
  }

  userv() {
    const user = this.ctx.session.user;
    if (!user || user == 'undefined' || user == undefined) {
      if (this.ctx.request.url !== '/admin/login') {
        this.ctx.redirect('/admin/login');
      }
    }
  }

}
module.exports = AdminBaseontroller;