const crypto = require('crypto');
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
}

function getInstance() {
    if (!mTool) {
        mTool = new _tool();
    }
    return mTool;

}
module.exports = getInstance();