'use strict';

const UserInfoController = require('../base/userinfo');
const fs = require('fs');
const sendToWormhole = require('stream-wormhole');
const pump = require('mz-modules/pump');
const path = require('path');
const moment = require('moment');
const ErrMsg = require('../../global/errmsg');

/**
 * 文章
 */
class ArticleController extends UserInfoController {

    async index() {
        const { ctx } = this;
        const data = await ctx.service.article.list(ctx.session.userid);
        await ctx.render('/user/article/index.ejs', {
            data: data,
            moment: moment
        });
    }

    async info() {
        const { ctx } = this;
        const id = ctx.request.query.id;
        const data = await ctx.service.article.find(id);
        await ctx.render('/user/article/edit.ejs', {
            data: data
        });
    }


    async article() {
        const { ctx } = this;
        const METHOD = ctx.request.method;
        if (METHOD == 'GET') {
            await ctx.render('/user/article/add.ejs')
        } else if (METHOD == 'POST') {
            let info = ctx.request.body;
            info.sid = ctx.session.userid;
            const res = await ctx.service.article.insert(info);
            if (res) {
                ctx.body = { code: 1 };
            } else {
                ctx.body = { code: 0, err: ErrMsg[6] };
            }
        } else if (METHOD == 'PUT') {
            let info = ctx.request.body.info;
            let id = ctx.request.body.id;
            if (await ctx.service.article.edit(ctx.session.userid, id, info)) {
                ctx.body = { code: 1 };
            } else {
                ctx.body = { code: 0, err: ErrMsg[4] };
            }
        } else if (METHOD == 'DELETE') {
            let id = ctx.request.body.id;
            if (await ctx.service.article.delete(id, ctx.session.userid)) {
                ctx.body = { code: 1 };
            }else{
                ctx.body = { code: 0, err: ErrMsg[5] };
            }
        }
    }
    /**
     * 文章上传图片
     */
    async upload() {
        const { ctx } = this;
        this.userv();
        const parts = ctx.multipart({ autoFields: true });
        let part;
        let files = [];
        let userid = ctx.session.userid;
        while ((part = await parts()) != null) {
            if (part.length) {
            } else {
                if (!part.filename) {
                    break;
                }
                files.push(await this.uploadFile(part, userid));
            }
        }
        ctx.body = { uploaded: 1, url: `/public/article/${userid}/` + files[0] };
    }

    /**
     * 具体保存文件
     * @param {*} part 
     * @param {*} nowdir 
     */
    async uploadFile(part, nowdir) {
        try {
            const filename = new Date().getTime() + part.filename.toLowerCase();
            const dir = this.config.baseDir + `/app/public/article/${nowdir}/`;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            const target = path.join(dir, filename);
            const writeStream = fs.createWriteStream(target);
            await pump(part, writeStream);
            return filename;
        } catch (err) {
            await sendToWormhole(part);
            throw err;
        }
    }
}

module.exports = ArticleController;
