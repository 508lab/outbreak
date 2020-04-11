'use strict';

const Controller = require('egg').Controller;
const { logindata } = require('../validate/home');
const ErrMsg = require('../global/errmsg');
const moment = require('moment');
const Tool = require('../global/tool');

class HomeController extends Controller {

  async index() {
    const { ctx } = this;
    if (ctx.session.userid) {
      ctx.redirect('/info/index');
    } else {
      await ctx.render('index.ejs');
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
    const user = await ctx.service.students.find(info);
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
   * 班级信息查询
   */
  async classaerch() {
    const { ctx } = this;
    let info = ctx.query;
    let time = moment().format("YYYY-MM-DD");
    if (info && info != undefined && info.clas) {
      time = info.time;
      let result = await ctx.service.students.findByClasAndTime(info.clas, info.department, time);
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
    this.ctx.body = { code: 1, data: await Tool.getClassDepData() };
  }

}

module.exports = HomeController;
