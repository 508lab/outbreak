const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
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
     * 获取系与班级的对于关系
     */
    async getClassDepData() {
        return JSON.parse(await fs.readFileSync(path.resolve(__dirname, '../../db/clasdepartment.json')));
    }

    async setClassDepData(data) {
        return await fs.writeFileSync(path.resolve(__dirname, '../../db/clasdepartment.json'), data);
    }

}

function getInstance() {
    if (!mTool) {
        mTool = new _tool();
    }
    return mTool;
}
module.exports = getInstance();