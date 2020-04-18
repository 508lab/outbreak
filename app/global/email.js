const nodemailer = require('nodemailer');
const Tool = require('./tool');
/**
 * 发送邮件
 */
module.exports = async function (email, subject, text, html) {
    let conf = await Tool.getEmailConf();
    if (conf.status == 0) {
        return false;
    }
    let send_tag = true;
    let transporter = nodemailer.createTransport({
        service:  conf.service,
        port: parseInt(conf.port),
        secureConnection: true,
        auth: {
            type: 'login',
            user: conf.user,
            pass: conf.password
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    let info = await transporter.sendMail({
        from: conf.user,
        to: email,
        subject: subject,
        text: text,
        html: html
    }).catch((err) => {
        send_tag = false;
        console.error(err);
    });
    if (!info.messageId) {
        send_tag = false;
    }
    // console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview only available when sending through an Ethereal account
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return send_tag;
}