const nodemailer = require('nodemailer');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const sendEmail = async (options) => {
    let html = await fs.promises.readFile(path.join(__dirname, 'email.html'), 'utf-8');
    html = html.replace('--title--', options.subject);
    html = html.replace('--name--', options.name);
    html = html.replace('--address--', options.address);
    html = html.replace('--phone--', options.phone);
    html = html.replace('--email--', options.email);

    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'abctien2003@gmail.com',
            pass: 'opqqnnnczndqwnpl',
        },
    });
    // 2) Define the email options
    const mailOptions = {
        from: 'Tổ chức bảo vệ động vật cơ nhỡ',
        to: options.to,
        subject: options.subject,
        // text: options.message,
        html,
    };
    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
