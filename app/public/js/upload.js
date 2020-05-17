/**
 * 分片上传文件
 * @param {*} file //文件
 * @param {*} url  //post请求地址   返回json格式：{ code: 1, data: { index: index } }
 * @param {*} form //请求附加参数 
 * @param {*} callbak  //回调
 */
function uploadFile(file, url, form, callbak) {

    let = fileObj = {
        chunks: [],
        name: ''
    };

    let chunk = 100 * 1024;
    let now_index = 0;
    let start = 0;
    let err_tag = false;
    fileObj.name = file.name;
    //文件分片
    for (let i = 0; i < Math.ceil(file.size / chunk); i++) {
        let end = start + chunk;
        fileObj.chunks[i] = file.slice(start, end);
        start = end;
    }

    let upload = function () {
        if (err_tag) {
            return;
        }
        if (fileObj.chunks.length !== now_index) {
            getFileBinary(fileObj.chunks[now_index], function (binary) {
                $.ajax({
                    url: url,
                    type: 'post',
                    data: Object.assign({ name: fileObj.name, data: binary, index: now_index, len: fileObj.chunks.length - 1 }, form),
                    success(data) {
                        if (data.code == 1) {
                            now_index += 1;
                            upload(now_index);
                            callbak(null, data, fileObj.chunks.length - 1);
                        }
                    },
                    error(err) {
                        err_tag = true;
                        callbak(err);
                        console.error(err);
                    }
                });
            })
        }
    }

    //获取文件二进制数据
    let getFileBinary = function (file, cb) {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (e) {
            if (typeof cb === "function") {
                cb.call(this, this.result);
            }
        }
    }

    upload(now_index);
}