const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.OAUTH_USER,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

const sendEmail = (to, subject, html) => {
  const mailOptions = {
    from: `"Job Portal" <${process.env.OAUTH_USER}>`,
    to: to,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error sending email:', error);
    }
    console.log('Email sent successfully: %s', info.response);
  });
};

module.exports = sendEmail;