'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class ArticleController extends Controller {

    async index() {
        await this.ctx.render('/article/index.ejs');
    }

    async data() {
        const { ctx } = this;
        let { limit, offset } = ctx.request.query;
        const list = await ctx.service.article.alllist({ audit: 1 }, parseInt(limit), parseInt(offset));
        ctx.body = { code: 1, data: list };
    }
}

module.exports = ArticleController;
