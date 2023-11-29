import { send_mail } from "./config/email.js";

(async function () {
    let mailOptions = {
        from: process.env.GMAIL_ID,
        to: 'arya250611@gmail.com',
        subject: 'Notes Verification OTP',
        text: `Your one-time password (OTP) for registering your account is: 123123`
    };
    try {
        let email_status = await send_mail(mailOptions);
        console.log(email_status);
    } catch (error) {
        console.error('Error sending email:', error);
    }
})();