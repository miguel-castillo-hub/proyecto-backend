import { Request, Response } from "express"
import createTemplate from "../utils/emailTemplate"
import transporter from "../config/emailConfig"

const emailService = async (request: Request, response: Response) => {
  const { subject, email, message } = request.body

  if (!subject || !email || !message) {
    return response.status(400).json({ success: false, message: "Data invalida" })
  }

  try {
    const info = await transporter.sendMail({
      from: `Mensaje d la tienda: ${email}`,
      to: process.env.EMAIL_USER,
      subject,
      html: createTemplate(email, message)
    })

    response.json({ success: true, message: "El correo fue enviado cn éxito", info })

  } catch (e) {
    const error = e as Error
    response.status(500).json({ success: false, error: error.message })
  }
}

export default emailService