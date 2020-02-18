const { Controller } = require('egg');

class UserInfoController extends Controller {
  userv() {
    const sid = this.ctx.session.userid;
    if (sid == null || sid == 'undefined' || sid == undefined) {
      this.ctx.redirect('/login');
    }
  }
}
module.exports = UserInfoController;