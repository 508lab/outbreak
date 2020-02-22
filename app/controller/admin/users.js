'use strict';

const AdminBaseontroller = require('./base');
const ErrMsg = require('../../global/errmsg');

/**
 * 管理员帐号中心
 */
class AdminUsersController extends AdminBaseontroller {
    async index() {
        const { ctx } = this;
        this.userv();
        await ctx.render('/admin/user.ejs', {
        });
    }

    async password() {
        const { ctx } = this;
        this.userv();
        let info = ctx.request.body;
        const id = ctx.session.user.id;
        //旧密码是否正确
        const user = await ctx.service.admin.findById(id);
        if (user.password !== info.oldpassword) {
            ctx.body = { code: 0, err: ErrMsg[16] };
            return;
        }
        if (info.password !== info.conpassword) {
            ctx.body = { code: 0, err: ErrMsg[17] };
            return;
        }

        const res = await ctx.service.admin.changePass(id, info.password, info.oldpassword);
        if (res) {
            ctx.body = { code: 1 };
        } else {
            ctx.body = { code: 0, err: ErrMsg[4] };
        }
    }
}

module.exports = AdminUsersController;
