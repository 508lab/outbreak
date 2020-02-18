const { Controller } = require('egg');

/**
 * 对admin进行统一验证
 */
class AdminBaseontroller extends Controller {

  userv() {
    const user = this.ctx.session.user;
    if (!user || user == 'undefined' || user == undefined) {
      this.ctx.redirect('/admin/login');
    }
  }

}
module.exports = AdminBaseontroller;