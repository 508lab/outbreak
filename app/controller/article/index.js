'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class ArticleController extends Controller {

    async index() {
        await this.ctx.render('/article/index.ejs');
    }

    async data() {
        const { ctx } = this;
        let { limit, offset, search } = ctx.request.query;
        let list = [];
        if (search) {
            list = await ctx.service.article.likeQuery(search, 9);
        }else{
            list = await ctx.service.article.alllist({ audit: 1 }, parseInt(limit), parseInt(offset));
        }
        
        ctx.body = { code: 1, data: list };
    }

    async find() {
        const { ctx } = this;
        const data = await ctx.service.article.findByAudit(ctx.request.query.id, 1);
        await ctx.render('/article/article.ejs', {data: data, moment: moment});
    }
}

module.exports = ArticleController;
