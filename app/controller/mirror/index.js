'use strict';

const { Controller } = require('egg');
const fs = require('fs');
const sendToWormhole = require('stream-wormhole');
const pump = require('mz-modules/pump');
const path = require('path');
const Tool = require('../../global/tool');
const ErrMsg = require('../../global/errmsg');
const FileHound = require('filehound');

/**
 * 学习资料
 */
class MirrorController extends Controller {
    /**
     * 获取首页json
     */
    async index() {
        const { ctx } = this;
        let q = ctx.request.body.q || '/';
        let basePath = this.config.baseDir + '/app/public/mirror' + q;
        const arr = await fs.readdirSync(basePath, { withFileTypes: true });
        let list = {
            files: arr.filter((ele) => { return !ele.isDirectory() }),
            dirs: arr.filter((ele) => { return ele.isDirectory() })
        };
        ctx.body = { code: 1, data: list };
    }

    async upload() {
        const { ctx } = this;
        this.userv();
        const parts = ctx.multipart({ autoFields: true });
        let part;
        let files = [];

        while ((part = await parts()) != null) {
            if (part.length) {
            } else {
                if (!part.filename) {
                    break;
                }
                if (await fs.existsSync(this.config.baseDir + '/app/public/mirror' + parts.field.dir + part.filename)) {
                    ctx.body = { code: 0, err: ErrMsg[22] };
                } else {
                    files.push(await this.uploadFile(part, parts.field.dir));
                }
            }
        }
        ctx.body = { code: 1, data: files };
    }

    /**
     * 创建文件夹
     */
    async mkdir() {
        const { ctx } = this;
        this.userv();
        let { dir, name } = ctx.request.body;
        let basePath = this.config.baseDir + '/app/public/mirror' + dir + name;
        if (await fs.existsSync(basePath)) {
            ctx.body = { code: 0, err: ErrMsg[23] };
        } else {
            await fs.mkdirSync(basePath);
            ctx.body = { code: 1 };
        }
    }


    /**
     * 删除文件或者文件夹
     */
    async delete() {
        const { ctx } = this;
        this.userv();
        let { dir, name, type } = ctx.request.body;
        let basePath = this.config.baseDir + '/app/public/mirror' + dir + name;
        if (await fs.existsSync(basePath)) {
            if (type == 'file') {
                await fs.unlinkSync(basePath);
            } else {
                await Tool.rmdirAsync(basePath);
            }
            ctx.body = { code: 1 };
        } else {
            ctx.body = { code: 0, err: ErrMsg[24] };
        }
    }

    /**
     * 修改文件或者文件夹名称
     */
    async update() {
        const { ctx } = this;
        this.userv();
        let { dir, name, oldname } = ctx.request.body;
        let basePath = this.config.baseDir + '/app/public/mirror' + dir + oldname;
        let newPath = this.config.baseDir + '/app/public/mirror' + dir + name;
        if (await fs.existsSync(basePath)) {
            await fs.renameSync(basePath, newPath);
            ctx.body = { code: 1 };
        } else {
            ctx.body = { code: 0, err: ErrMsg[25] };
        }
    }

    async search() {
        const { ctx } = this;
        let { dir, q } = ctx.request.body;
        let basePath = this.config.baseDir + '/app/public/mirror' + dir
        let files = await FileHound.create()
            .paths(basePath)
            .match(`*${q}*`)
            .findSync();
        let dirs = await FileHound.create()
            .paths(basePath)
            .directory()
            .match(`*${q}*`)
            .findSync();
        let list = {
            files: files.map((e) => { return { name: e.slice(basePath.length, e.length) } }),
            dirs: dirs.map((e) => { return { name: e.slice(basePath.length, e.length) } })
        };
        ctx.body = { code: 1, data: list };
    }

    /**
     * 具体保存文件
     * @param {*} part 
     * @param {*} nowdir 
     */
    async uploadFile(part, nowdir) {
        try {
            const filename = part.filename.toLowerCase();
            const dir = this.config.baseDir + `/app/public/mirror${nowdir}`;
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

    userv() {
        const sid = this.ctx.session.teacherid;
        if (sid == null || sid == 'undefined' || sid == undefined) {
            if (this.ctx.request.url !== '/teacher/login') {
                this.ctx.redirect('/teacher/login');
            }
        }
    }
}

module.exports = MirrorController;
