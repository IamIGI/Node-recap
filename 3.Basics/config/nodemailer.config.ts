import nodemailer from 'nodemailer';

// https://stackoverflow.com/questions/59188483/error-invalid-login-535-5-7-8-username-and-password-not-accepted
// set app password gmailAccount -> security -> 2-way_verification -> bottom_of_the_page -> App_password
const email = process.env.EMAIL_SENDER_EMAIL;
const pass = process.env.EMAIL_SENDER_PASSWORD;

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass,
  },
});

export const mailOptions = {
  from: email,
};
