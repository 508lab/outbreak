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
        let stat = await fs.statSync(filePath)
        if (stat.isFile()) {
            await fs.unlinkSync(filePath)
        } else {
            let dirs = await fs.readdirSync(filePath)
            dirs = dirs.map(dir => this.rmdirAsync(path.join(filePath, dir)))
            await Promise.all(dirs)
            await fs.rmdirSync(filePath)
        }
    }
}

function getInstance() {
    if (!mTool) {
        mTool = new _tool();
    }
    return mTool;

}
module.exports = getInstance();