const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const SECRET = "123456";
let mTool = null;

class _tool {
    /**
     * 加密
     * @param {*} str 
     */
    encryption(str) {
        return crypto.createHmac('sha256', str)
            .update(SECRET)
            .digest('hex');
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