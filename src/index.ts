// LEVANTAR NUESTRO SERVICIO Y CONFIGURACIONES GLOBALES
import express, { Request, Response } from "express"
import cors from "cors"
import { connectDB } from "./config/mongodb"
import productRouter from "./routes/productRoutes"
import userRouter from "./routes/usersRoutes"
import morgan from "morgan"
import limiter from "./middleware/rateLimitMiddleware"
import IUserTokenPayload from "./interfaces/IUserTokenPayload"
import dotenv from "dotenv"
import logger from "./config/logger"
import transporter from "./config/emailConfig"
import createTemplate from "./utils/emailTemplate"
dotenv.config()

declare global {
  namespace Express {
    interface Request {
      user?: IUserTokenPayload
    }
  }
}

const PORT = process.env.PORT

const app = express()

// middleware
app.use(cors())
app.use(express.json())
app.use(logger)

app.use(morgan("dev"))

app.get("/", (request: Request, response: Response) => {
  response.json({ status: true })
})

app.use("/v3/auth", limiter, userRouter)
// http://localhost:3861/v3/productos?
app.use("/v3/productos", productRouter)

// enviar email
app.post("/email/send", async (request, response) => {
  const { subject, email, message } = request.body

  if (!subject || !email || !message) {
    return response.status(400).json({ success: false, message: "Data invalida" })
  }

  try {
    const info = await transporter.sendMail({
      from: `Mensaje d la tienda: ${email}`,
      to: process.env.EMAIL_USER,
      subject,
      html: createTemplate(message)
    })

    response.json({ success: true, message: "El correo fue enviado cn éxito", info })

  } catch (e) {
    const error = e as Error
    response.status(500).json({ success: false, error: error.message })
  }
})

// endpoint para el status del servidor
app.use((request, response) => {
  response.status(404).json({ error: "El recurso no se encuentra" })
})

// servidor en escucha
app.listen(PORT, () => {
  console.log(`YOUR TAKING TOO http://localhost:${PORT}`)
  connectDB()
})