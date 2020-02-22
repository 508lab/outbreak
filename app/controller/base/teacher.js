const { Controller } = require('egg');

class TeacherBaseController extends Controller {
    userv() {
        const sid = this.ctx.session.teacherid;
        if (sid == null || sid == 'undefined' || sid == undefined) {
            this.ctx.redirect('/teacher/login');
        }
    }
}
module.exports = TeacherBaseController;