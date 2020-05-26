const { Controller } = require('egg');

/**
 * 对学生控制层统一验证
 */
class UserInfoBaseController extends Controller {
  constructor(app) {
    super(app);
    this.userv();
  }

  userv() {
    const sid = this.ctx.session.userid;
    if (sid == null || sid == 'undefined' || sid == undefined) {
      if (this.ctx.request.url !== '/login') {
        this.ctx.redirect('/login');
      }
    }
  }
}
module.exports = UserInfoBaseController;