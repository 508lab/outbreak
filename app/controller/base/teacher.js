const { Controller } = require('egg');

class TeacherBaseController extends Controller {
    constructor(app) {
        super(app);
        this.userv();
    }

    userv() {
        const sid = this.ctx.session.teacherid;
        if (sid == null || sid == 'undefined' || sid == undefined) {
            if (this.ctx.request.url !== '/teacher/login') {
                this.ctx.redirect('/teacher/login');
            }
        }
    }
}
module.exports = TeacherBaseController;