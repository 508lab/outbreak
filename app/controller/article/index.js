'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');
const Tool = require('../../global/tool');
const ErrMsg = require('../../global/errmsg');

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
        } else {
            list = await ctx.service.article.alllist({ audit: 1 }, parseInt(limit), parseInt(offset));
        }

        ctx.body = { code: 1, data: list };
    }

    async find() {
        const { ctx } = this;
        let login = 0;
        if (this.isLogin(ctx)) {
            login = 1;
        }
        let id = ctx.request.query.id;
        const data = await ctx.service.article.findByAudit(id, 1);
        const comments = await ctx.service.comments.getComments({ aid: id }, ['content', 'time']);
        await ctx.render('/article/article.ejs', { data: data, moment: moment, login: login, comments: comments });
    }

    /**
     * 评论
     */
    async comment() {
        const { ctx } = this;
        const sid = this.isLogin(ctx);
        if (!sid) {
            ctx.body = { code: 0, err: ErrMsg[0] };
            return;
        }
        let info = ctx.request.body;
        if (Object.keys(await Tool.isSensitiveWord(info.content)).length) {
            ctx.body = { code: 0, err: ErrMsg[13] };
            return
        }
        let time = new Date();
        const res = await ctx.service.comments.insert({ content: info.content, sid: sid, aid: info.aid, time: time });
        if (res) {
            ctx.body = { code: 1, time: time };
        } else {
            ctx.body = { code: 0, err: ErrMsg[6] };
        }
    }

    /**
     * 获取文章标签
     */
    async articletags() {
        this.ctx.body = { code: 1, data: await Tool.getArticleTags() };
    }

    isLogin(ctx) {
        const sid = ctx.session.userid;
        if (sid !== null && sid !== 'undefined' && sid !== undefined) {
            return sid;
        }
        return 0;
    }

}

module.exports = ArticleController;
