'use strict';

const Controller = require('egg').Controller;
const { entryvalidate, logindata } = require('../validate/home');
const ErrMsg = require('../global/errmsg');
const moment = require('moment');
const ClasDeartment = require('../global/clasdepartment');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    if (ctx.session.userid) {
      ctx.redirect('/info/index');
    } else {
      await ctx.render('register.ejs');
    }
  }

  /**
   * 登陆页面
   */
  async login() {
    const { ctx } = this;
    if (ctx.session.userid) {
      ctx.redirect('/info/index');
    } else {
      await ctx.render('login.ejs');
    }
  }

  /**
   * 登陆功能
   */
  async loginin() {
    const { ctx } = this;
    let info = ctx.request.body;
    ctx.validate(logindata, info);
    ctx.coreLogger.info('---student-login---' + JSON.stringify(info));
    const user = await ctx.service.user.find(info);
    if (user && user.id) {
      ctx.session.userid = user.id;
      ctx.body = { code: 1 };
    } else {
      ctx.body = { code: 0, err: ErrMsg[9] };
    }
  }

  async loginout() {
    const { ctx } = this;
    ctx.session.userid = null;
    ctx.redirect('/login');
  }

  /**
   * 注册
   */
  async register() {
    const { ctx } = this;
    await ctx.render('register.ejs');
  }

  /**
   * 录入信息
   */
  async entry() {
    const { ctx } = this;
    const sid = ctx.query.id;
    const res = await this.validateUser(sid);
    let err = ''
    if (res === 3) {
      err = ErrMsg[18];
    }
    await ctx.render('entry.ejs', { data: res, err: err });
  }

  /**
   * 录入基本信息
   */
  async entrydata() {
    const { ctx } = this;
    let info = ctx.request.body;
    ctx.validate(entryvalidate, info);
    const res = await this.validateUser(info.studentid);
    if (res === 3) {
      ctx.body = { code: 0, err: ErrMsg[18] };
      return;
    } else {
      //比对学生库中的信息
      if (res.name != info.name || res.id != info.studentid || res.clas != info.clas || res.department != info.department) {
        ctx.body = { code: 0, err: ErrMsg[19] };
        return;
      }
      if (await ctx.service.user.findByStudentId(info.studentid)) {
        ctx.body = { code: 0, err: ErrMsg[2] }
        return;
      }
      const user = await ctx.service.user.insert(info);
      if (user.insertId) {
        ctx.session.userid = user.insertId;
        ctx.body = { code: 1 };
      } else {
        ctx.body = { code: 0, err: ErrMsg[7] };
      }
    }
  }

  /**
   * 学号对比校验
   */
  async validateUser(id) {
    let user = await this.ctx.service.students.findById(id);
    if (!user) {
      return 3;
    }
    return user;
  }

  /**
   * 班级信息查询
   */
  async classaerch() {
    const { ctx } = this;
    let info = ctx.query;
    let time = moment().format("YYYY-MM-DD");
    if (info && info != undefined && info.clas) {
      time = info.time;
      let result = await ctx.service.user.findByClasAndTime(info.clas, info.department, time);
      const studens = await ctx.service.students.findUsersByClasDep(info.department, info.clas);
      result = this.getNoWriteNow(studens, result);
      await ctx.render('classaerch.ejs', {
        clas: info.clas,
        department: info.department,
        data: result,
        time: time
      });
    } else {
      await ctx.render('classaerch.ejs', {
        clas: null,
        department: null,
        time: time
      });
    }
  }

  getNoWriteNow(studens, data) {
    let yids = data.map(function (e) {
      return e.studentid;
    });
    let result = [];
    studens.map(function (ele) {
      if (!yids.includes(ele.id) && ele.name != '' && ele.name != undefined) {
        result.push({
          name: ele.name,
          record: 0
        })
      }
    });
    data.map(function (ele) {
      result.push({
        name: ele.name,
        record: ele.record
      })
    })
    return result;
  }

  /**
 * 获取所有系与班级的信息
 */
  async clasdepartment() {
    this.ctx.body = { code: 1, data: ClasDeartment };
  }
}

module.exports = HomeController;
