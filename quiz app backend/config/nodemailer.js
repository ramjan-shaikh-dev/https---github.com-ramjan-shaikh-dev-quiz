const nodemailer = require("nodemailer");

const email='ramjanshaikh313786313@gmail.com';
const password='ulsy pxgj vagx dbzm';


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: email,
        pass: password
    }
});

module.exports = transporter;