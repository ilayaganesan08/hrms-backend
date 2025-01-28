require('dotenv').config();
const nodemailer = require('nodemailer');

function MailSend(mailOptions, callback) {
	const transporter = nodemailer.createTransport({
		service: 'gmail', // Use your email service
		auth: {
			user: process.env.NODEMAILEREMAILID,
			pass: process.env.NODEMAILEREMAILPASSWORD
		}
	});

	transporter.sendMail(mailOptions, (error, response) => {
		callback(error, response);
	});
}

module.exports = {
	MailSend: MailSend
};
