'use strict';

const Controller = require('egg').Controller;
const ClasDeartment = require('../../global/clasdepartment');
const moment = require('moment');
const { bardatavali, bardataClasVali } = require('../../validate/vis');

class VisApiController extends Controller {
    /**
     * 返回所以系与班级名称
     * 获取学生与教师的统计统计
     */
    async index() {
        const { ctx } = this;
        const data = await ctx.service.temperature.outstandard(37.0);
        const teacher = await ctx.service.teachertemp.outstandard(37.0);
        ctx.body = { code: 1, clasdep: ClasDeartment, students: data, teachers: teacher }
    }

    /**
     * 根据班级或者系获取当天的温度区间统计
     * ["35.0-36.0", "36.0-37.0", "37.0-38.0", "38.0-39.0", "39.0-40.0"]
     */
    async bardata() {
        const { ctx } = this;
        let info = ctx.query;
        const now = moment().format("YYYY-MM-DD");
        if (info.type == 1) {  //根据系别统计
            ctx.validate(bardatavali, info);
            const result = await ctx.service.temperature.bardataByDep([now, now], info.department);
            ctx.body = { code: 1, data: result };
        } else if (info.type == 2) { //根据班级去统计
            ctx.validate(bardataClasVali, info);
            const result = await ctx.service.temperature.bardataByClas([now, now], info.department, info.clas);
            ctx.body = { code: 1, data: result };
        }
    }
}

module.exports = VisApiController;
