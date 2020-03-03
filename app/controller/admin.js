'use strict';

const AdminBaseontroller = require('./admin/base');
const { loginin, clasdatav } = require('../validate/admin');
const ErrMsg = require('../global/errmsg');
const ClasDeartment = require('../global/clasdepartment');

/**
 * 后台管理
 */
class AdminController extends AdminBaseontroller {
  async index() {
    const { ctx } = this;
    this.userv();
    const data = await ctx.service.temperature.outstandard(37.0);
    const teacher = await ctx.service.teachertemp.outstandard(37.0);
    await ctx.render('/admin/index.ejs', {
      data: data,
      teacher: teacher
    });
  }

  async search() {
    const { ctx } = this;
    this.userv();
    let record = 37.0, time = 'day';
    if (ctx.query.record) {
      record = parseFloat(ctx.query.record);
    }
    if (ctx.query.time) {
      time = ctx.query.time;
    }
    let data = await ctx.service.temperature.dataByRecord(record, time);
    await ctx.render('/admin/search.ejs', {
      data: data,
      record: record,
      time: time
    });
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
   * 班级
   */
  async clas() {
    const { ctx } = this;
    this.userv();
    const result = await ctx.service.user.clas();
    await ctx.render('/admin/clas.ejs', {
      data: result
    });
  }

  /**
   * 班级中具体信息
   */
  async clasdata() {
    const { ctx } = this;
    this.userv();
    //统计班级信息
    if (ctx.query.clas && ctx.query.department) {
      let time = 'day';
      if (ctx.query.time) {
        time = ctx.query.time;
      }
      const result = await ctx.service.user.findByClas(ctx.query.clas, ctx.query.department, time);
      await ctx.render('/admin/clasdata.ejs', {
        data: result,
        clas: ctx.query.clas,
        department: ctx.query.department,
        time: time
      });
    } else if (ctx.query.sid) {
      //统计个人信息
      const arr = await ctx.service.temperature.data(ctx.query.sid);
      await ctx.render('/admin/usertmp.ejs', {
        data: arr,
        n: ctx.query.n
      });
    } else {
      ctx.body = { code: 0, err: ErrMsg[1] };
    }
  }

  /**
   * 获取所有系与班级的信息
   */
  async clasdepartment() {
    this.ctx.body = { code: 1, data: ClasDeartment };
  }

  /**
   * 获取温度区间统计
   * ["35.0-36.0", "36.0-37.0", "37.0-38.0", "38.0-39.0", "39.0-40.0"]
   */
  async bardata() {
    const { ctx } = this;
    this.userv();
    let info = ctx.query;
    if (info.type == 1) {  //根据系别统计
      const result = await ctx.service.temperature.bardataByDep([info.starttime, info.endtime], info.department);
      ctx.body = { code: 1, data: result };
    } else if (info.type == 2) { //根据班级去统计
      const result = await ctx.service.temperature.bardataByClas([info.starttime, info.endtime], info.department, info.clas);
      ctx.body = { code: 1, data: result };
    }
  }

  /*
  * 武汉数据统计
  **/
  async wuhandata() {
    const { ctx } = this;
    this.userv();
    let info = ctx.query;
    if (info.type == 1) {
      const result = await ctx.service.user.findWuHan(`department='${info.department}'`);
      ctx.body = { code: 1, data: result };
    } else if (info.type == 2) {
      const result = await ctx.service.user.findWuHan(`department='${info.department}' AND clas='${info.clas}'`);
      ctx.body = { code: 1, data: result };
    }
  }


  /**
   * 修改个人密码
   */
  async userpass() {
    const { ctx } = this;
    this.userv();
    let res = await ctx.service.user.updatePassword(ctx.request.body.studentid, '123456');
    if (res) {
      ctx.body = { code: 1 };
    } else {
      ctx.body = { code: 0, err: ErrMsg[4] };
    }
  }

}

module.exports = AdminController;
