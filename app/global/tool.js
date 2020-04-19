const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const FastScanner = require('fastscan');
const SECRET = "1234567891234567", IV = '1234567891234567';
let mTool = null;

class _tool {
    /**
     * 加密
     * @param {*} str 
     */
    encryption(str) {
        let sign = '';
        const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(SECRET), Buffer.from(IV));
        sign += cipher.update(str, 'utf8', 'hex');
        sign += cipher.final('hex');
        return sign;
    }

    /**
     * 解密
     * @param {*} str 
     */
    decryption(str) {
        let src = '';
        const cipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(SECRET), Buffer.from(IV));
        src += cipher.update(str, 'hex', 'utf8');
        src += cipher.final('utf8');
        return src;
    }

    encryptionImg(str) {
        return crypto.createHmac('sha256', str)
            .update(SECRET)
            .digest('hex');
    }

    /**
     * 删除文件夹
     * @param {*} filePath 
     */
    async  rmdirAsync(filePath) {
        if (!await fs.existsSync(filePath)) {
            return;
        }
        let stat = await fs.statSync(filePath);
        if (stat.isFile()) {
            await fs.unlinkSync(filePath)
        } else {
            let dirs = await fs.readdirSync(filePath)
            dirs = dirs.map(dir => this.rmdirAsync(path.join(filePath, dir)))
            await Promise.all(dirs)
            await fs.rmdirSync(filePath)
        }
    }

    /**
     * 获取img中的src
     * @param {*} path 
     * @param {*} str 
     */
    getImgSrc(path, str) {
        let arr = str.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/ig);
        if (!Array.isArray(arr)) {
            return [];
        }
        return arr.map(function (ele) {
            return path + ele.slice(5, ele.length - 1);
        });
    }

    /**
     * delete 文件
     * @param {*} files 
     */
    async delFile(files) {
        for (let index = 0; index < files.length; index++) {
            await fs.unlinkSync(files[index]);
        }
    }

    /**
     * 获取系与班级的对应关系
     */
    async getClassDepData() {
        return JSON.parse(await fs.readFileSync(path.resolve(__dirname, '../../db/clasdepartment.json')));
    }

    /**
     * 设置系与班级的对应关系
     * @param {*} data 
     */
    async setClassDepData(data) {
        return await fs.writeFileSync(path.resolve(__dirname, '../../db/clasdepartment.json'), data);
    }

    /**
     * 设置文章的所有标签
     *  @param {*} data 
     */
    async setArticleTags(data) {
        return await fs.writeFileSync(path.resolve(__dirname, '../../db/articletags.json'), data);
    }

    /**
     * 获取文章的所有标签
     */
    async getArticleTags() {
        return JSON.parse(await fs.readFileSync(path.resolve(__dirname, '../../db/articletags.json')));
    }

    /**
     * 获取邮箱的配置
     */
    async getEmailConf() {
        return JSON.parse(await fs.readFileSync(path.resolve(__dirname, '../../db/email.json')));
    }

    /**
     * 设置邮箱的配置
     */
    async setEmailConf(data) {
        return await fs.writeFileSync(path.resolve(__dirname, '../../db/email.json'), data);
    }

    /**
     * 判断内容中是否包含敏感词
     * @param {*} msg 
     */
    async isSensitiveWord(msg) {
        const data = await fs.readFileSync(path.resolve(__dirname, '../../db/sensitive.json'));
        var scanner = new FastScanner(JSON.parse(data));
        return scanner.hits(msg);
    }
}

function getInstance() {
    if (!mTool) {
        mTool = new _tool();
    }
    return mTool;
}
module.exports = getInstance();