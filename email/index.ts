import nodemailer from 'nodemailer'
import {Request, Response} from "express";


const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASSWORD
	}
})

export const sendEmailToSupport = async (req: Request, res: Response) => {
	const {senderInfos, category, title, message} = req.body

	const mailOptions = {
		from: process.env.EMAIL,
		to: process.env.SUPPORT_EMAIL,
		subject: `KLIGO SUPPORT : ${senderInfos.firstname} needs help about ${category}`,
		text: message
	}

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error)
			res.status(500).send('An error occurred while sending email to support')
		} else {
			res.status(200).send('Email sent successfully to support')
		}
	})
}