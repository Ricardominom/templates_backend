"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthEmail = void 0;
const nodemailer_1 = require("../config/nodemailer");
class AuthEmail {
    static sendConfirmationEmail = async (user) => {
        const info = await nodemailer_1.transporter.sendMail({
            from: 'TemplatesApp <rdmm.291191@gmail.com>',
            to: user.email,
            subject: 'TemplatesApp - Confirm you account',
            text: 'TemplatesApp - Confirm your account',
            html: `<p>Hi! ${user.name}, you have created your TemplatesApp's account, it's almost complete, just confirm your account</p>
                <p>Check the following link:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirm account</a>
                <p>And enter the code: <b>${user.token}</b></p>
                <p>This token expires in 10 minutes</p>
            `
        });
        console.log('Message sended', info.messageId);
    };
    static sendPasswordResetToken = async (user) => {
        const info = await nodemailer_1.transporter.sendMail({
            from: 'TemplatesApp <rdmm.291191@gmail.com>',
            to: user.email,
            subject: 'TemplatesApp - Reset your password',
            text: 'TemplatesApp - Reset your password',
            html: `<p>Hi! ${user.name}, you have requested reset your password</p>
                <p>Check the following link:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reset Password</a>
                <p>And enter the code: <b>${user.token}</b></p>
                <p>This token expires in 10 minutes</p>
            `
        });
        console.log('Message sended', info.messageId);
    };
}
exports.AuthEmail = AuthEmail;
//# sourceMappingURL=AuthEmail.js.map