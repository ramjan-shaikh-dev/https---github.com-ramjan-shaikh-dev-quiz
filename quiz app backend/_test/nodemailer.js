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


async function sendEmail(to){
    // write you code here
     try {
        const info = await transporter.sendMail({
            from: email,
            to: to,
            subject: "Welcome",
            text: "Welcome to our application!"
        });

        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.log(error);
    }
}

let to="dhamihimanshu786@gmail.com"
sendEmail(to)