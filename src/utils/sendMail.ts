import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	auth: {
		user: process.env.MAIL_USERNAME,
		pass: process.env.MAIL_PASSWORD,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

const sendMail = async (to: string, subject: string, html: string) => {
	try {
		await transporter.sendMail({
			from: process.env.MAIL_USERNAME,
			to,
			subject,
			html,
		});
	} catch (error) {
		console.error(error);
	}
};

export default sendMail;
