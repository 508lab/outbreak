
/**
 * 对镜像资源的处理(学习资料)
 */
module.exports = () => {
    return async function (ctx, next) {
        const str = ctx.req.url.slice(0, 15);
        if (str === '/public/mirror/' || str === '/api/v1/mirror/') {
            let tag = ctx.session.userid || ctx.session.teacherid;
            if (tag) {
                await next();
            } else {
                ctx.redirect('/');
            }
        }else{
            await next();
        }
    }
};


