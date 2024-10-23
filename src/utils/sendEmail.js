const nodemailer = require('nodemailer')

// Utility function for sending emails
const sendEmail = async (to, subject, htmlContent) => {
	try {
		// Configure nodemailer transporter
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD
			}
		})

		// Define email options
		const mailOptions = {
			to,
			from: process.env.EMAIL_USER,
			subject,
			html: htmlContent
		}

		// Send email
		await transporter.sendMail(mailOptions)

		console.log(`Email sent to ${to} with subject ${subject} `)
	} catch (error) {
		console.error('Error sending email:', error)
		throw new Error('Failed to send email')
	}
}

module.exports = sendEmail
