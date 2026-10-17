const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendPasswordResetEmail = async (email, resetURL) => {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Reset Your Password",
        text: `You requested a password reset. Open this link to reset your password: ${resetURL}`,
        html: `
            <h2>Password Reset</h2>
            <p>You requested to reset your password.</p>
            <p>
                <a href="${resetURL}">Reset Password</a>
            </p>
            <p>This link expires in 10 minutes.</p>
            <p>If you did not request this, ignore this email.</p>
        `
    });
};

module.exports = {
    sendPasswordResetEmail
};
